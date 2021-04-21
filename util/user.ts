import { Status } from "../deps.ts";
import { DYNAMO_CLIENT } from "./clients.ts";
import { DYNAMO_USER_TABLE } from "./constants.ts";
import { generate } from "./token.ts";

export interface User {
  id: number;
  admin: boolean;
  secret: string;
}

export async function getUser(id: number): Promise<User | undefined> {
  const { Item: item } = await DYNAMO_CLIENT.getItem({
    TableName: DYNAMO_USER_TABLE,
    Key: {
      id: { N: id.toString() },
    },
  });

  if (item) {
    return {
      id: parseInt(item.id.N),
      admin: item.admin.BOOL,
      secret: item.secret.S,
    };
  }
}

export async function createUser(
  id: number,
  admin = false,
): Promise<User | undefined> {
  const secret = generate();

  const { $metadata: { httpStatusCode } } = await DYNAMO_CLIENT.putItem({
    TableName: DYNAMO_USER_TABLE,
    Item: {
      id: { N: id.toString() },
      secret: { S: secret },
      admin: { BOOL: admin },
    },
  });

  if (httpStatusCode === Status.OK) {
    return { id, admin, secret };
  }
}

export async function authenticate(
  id: number,
  secret: string,
  admin = false,
): Promise<boolean> {
  const user = await getUser(id);

  return !(user?.secret !== secret && (admin ? user?.admin : true));
}
