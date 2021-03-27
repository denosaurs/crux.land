import { DynamoDBClient, GetItemCommand } from "../deps.ts";
import {
  DYNAMO_ACCESS_KEY_ID,
  DYNAMO_REGION,
  DYNAMO_SECRET_ACCESS_KEY,
  DYNAMO_TABLE,
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

  const {
    Item: item,
  } = await client.send(
    new GetItemCommand({
      TableName: DYNAMO_TABLE,
      Key: {
        alias: { S: alias },
      },
    }),
  );

  if (item === undefined || item[tag]?.S === undefined) {
    return undefined;
  }

  return item[tag].S;
}
