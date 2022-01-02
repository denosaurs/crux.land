import { marshall, unmarshall } from "../server_deps.ts";
import { DYNAMO_CLIENT } from "./clients.ts";
import { DYNAMO_ALIAS_TABLE } from "./backend_constants.ts";
import { Alias, Requests } from "./shared_interfaces.ts";

export async function getRequests(): Promise<Requests> {
  const { Item: item } = await DYNAMO_CLIENT.getItem({
    TableName: DYNAMO_ALIAS_TABLE,
    Key: marshall({
      alias: "$requests",
    }),
  });

  if (item === undefined) {
    await DYNAMO_CLIENT.putItem({
      TableName: DYNAMO_ALIAS_TABLE,
      Item: marshall({
        alias: "$requests",
        requests: [],
      }),
    });

    return [];
  }

  return unmarshall(item).requests;
}

export async function pushRequest(alias: Alias) {
  const requests = await getRequests();
  requests.push(alias);

  return await DYNAMO_CLIENT.putItem({
    TableName: DYNAMO_ALIAS_TABLE,
    Item: marshall({
      alias: "$requests",
      requests,
    }),
  });
}

export async function approveRequest(owner: number, alias: string) {
  const requests = await getRequests();
  const found = requests.splice(
    requests.findIndex((request) =>
      request.owner === owner && request.alias === alias
    ),
    1,
  )[0];

  if (found) {
    await putAlias(found);
  } else {
    return;
  }

  return await DYNAMO_CLIENT.putItem({
    TableName: DYNAMO_ALIAS_TABLE,
    Item: marshall({
      alias: "$requests",
      requests,
    }),
  });
}

export async function denyRequest(owner: number, alias: string) {
  const requests = await getRequests();
  requests.splice(
    requests.findIndex((request) =>
      request.owner === owner && request.alias === alias
    ),
    1,
  );

  return await DYNAMO_CLIENT.putItem({
    TableName: DYNAMO_ALIAS_TABLE,
    Item: marshall({
      alias: "$requests",
      requests,
    }),
  });
}

export async function getAlias(alias: string): Promise<Alias | undefined> {
  const { Item: item } = await DYNAMO_CLIENT.getItem({
    TableName: DYNAMO_ALIAS_TABLE,
    Key: marshall({ alias }),
  });

  if (item) {
    return unmarshall(item);
  }
}

export async function putAlias(alias: Alias) {
  return await DYNAMO_CLIENT.putItem({
    TableName: DYNAMO_ALIAS_TABLE,
    Item: marshall(alias),
  });
}

export async function getIdFromAlias(
  alias: string,
  tag: string,
): Promise<string | undefined> {
  const item = await getAlias(alias);

  if (item === undefined) {
    return undefined;
  }

  return item.tags[tag];
}

export async function listAliases(id: number): Promise<Alias[]> {
  const { Items: items } = await DYNAMO_CLIENT.scan({
    TableName: DYNAMO_ALIAS_TABLE,
    FilterExpression: "#owner = :owner",
    ExpressionAttributeValues: {
      ":owner": { "N": id.toString() },
    },
    ExpressionAttributeNames: {
      "#owner": "owner",
    },
  });

  if (items) {
    return items.map(unmarshall);
  } else {
    return [];
  }
}
