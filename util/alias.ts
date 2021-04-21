import { DYNAMO_CLIENT } from "./clients.ts";
import { DYNAMO_ALIAS_TABLE } from "./constants.ts";

export type Tags = Record<string, string>;

export interface Alias {
  alias: string;
  owner: number;
  tags: Tags;
}

export type Requests = Alias[];

export async function getAlias(alias: string): Promise<Alias | undefined> {
  const { Item: item } = await DYNAMO_CLIENT.getItem({
    TableName: DYNAMO_ALIAS_TABLE,
    Key: {
      alias: { S: alias },
    },
  });

  if (item) {
    return {
      alias: item.alias.S,
      owner: parseInt(item.owner.N),
      tags: Object.fromEntries(
        Object.entries(item.tags.M as Record<string, { S: string }>).map((
          [tag, { S: id }],
        ) => [tag, id]),
      ),
    };
  }
}

export async function putAlias(alias: Alias) {
  return await DYNAMO_CLIENT.putItem({
    TableName: DYNAMO_ALIAS_TABLE,
    Item: {
      alias: { S: alias.alias },
      owner: { N: alias.owner.toString() },
      tags: {
        M: Object.fromEntries(
          Object.entries(alias.tags).map(([tag, id]) => [tag, { S: id }]),
        ),
      },
    },
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
