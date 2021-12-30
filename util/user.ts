import { marshall, Status, unmarshall } from "../server_deps.ts";
import { DYNAMO_CLIENT } from "./clients.ts";
import { DYNAMO_USER_TABLE } from "./backend_constants.ts";
import { generate } from "./token.ts";

export interface User {
  id: number;
  admin: boolean;
  secret: string;
}

export async function getUser(id: number): Promise<User | undefined> {
  const { Item: item } = await DYNAMO_CLIENT.getItem({
    TableName: DYNAMO_USER_TABLE,
    Key: marshall({ id }),
  });

  if (item) {
    return unmarshall(item);
  }
}

export async function createUser(
  id: number,
  admin = false,
): Promise<User | undefined> {
  const secret = generate();

  try {
    await DYNAMO_CLIENT.putItem({
      TableName: DYNAMO_USER_TABLE,
      Item: marshall({ id, secret, admin }),
    });
    return { id, admin, secret };
  } catch (e) {
    // TODO
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
