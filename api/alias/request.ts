import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  Status,
} from "../../deps.ts";
import {
  ALIAS_NAME_REGEX_TEST,
  DYNAMO_ACCESS_KEY_ID,
  DYNAMO_REGION,
  DYNAMO_SECRET_ACCESS_KEY,
  DYNAMO_TABLE,
} from "../../util/constants.ts";
import { generate } from "../../util/token.ts";
import {
  aliasCollision,
  aliasFailed,
  invalidAlias,
  invalidMethod,
  json,
} from "../../util/responses.ts";
import { Match } from "../../util/router.ts";

export async function request(
  req: Request,
  match: Match,
): Promise<Response> {
  if (req.method !== "POST") {
    return invalidMethod();
  }

  const { alias } = await req.json();

  if (typeof alias !== "string" && ALIAS_NAME_REGEX_TEST.test(alias)) {
    return invalidAlias();
  }

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
      TableName: DYNAMO_TABLE,
      Key: {
        alias: { S: alias },
      },
    }),
  );

  if (item) {
    return aliasCollision();
  }

  const secret = generate();

  // @ts-ignore TS2339
  const { $metadata: { httpStatusCode } } = await client.send(
    new PutItemCommand({
      TableName: DYNAMO_TABLE,
      Item: {
        alias: { S: alias },
        secret: { S: secret },
      },
    }),
  );

  if (httpStatusCode !== Status.OK) {
    return aliasFailed();
  }

  return json({ secret });
}
