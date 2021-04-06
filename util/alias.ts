import { DynamoDBClient, GetItemCommand } from "../deps.ts";
import {
  DYNAMO_ACCESS_KEY_ID,
  DYNAMO_ALIAS_TABLE,
  DYNAMO_REGION,
  DYNAMO_SECRET_ACCESS_KEY,
} from "./constants.ts";

export async function getIdFromAlias(
  alias: string,
  tag: string,
): Promise<string | undefined> {
  const client = new DynamoDBClient({
    region: DYNAMO_REGION,
    credentials: {
      accessKeyId: DYNAMO_ACCESS_KEY_ID,
      secretAccessKey: DYNAMO_SECRET_ACCESS_KEY,
    },
  });

  // @ts-ignore TS2339
  const { Item: item } = await client.send(
    new GetItemCommand({
      TableName: DYNAMO_ALIAS_TABLE,
      Key: {
        alias: { S: alias },
      },
    }),
  );

  const id = item?.tags?.M?.[tag]?.S;

  if (id === null || id === undefined) {
    return undefined;
  }

  return id;
}
