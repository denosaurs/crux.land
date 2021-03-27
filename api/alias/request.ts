import {
  DynamoDBClient,
  GetItemCommand,
  MatchResult,
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

export async function request(
  req: Request,
  match: MatchResult,
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

  {
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

    if (item) {
      return aliasCollision();
    }
  }

  const secret = generate();

  {
    const {
      $metadata: { httpStatusCode },
    } = await client.send(
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
  }

  return json({ secret });
}
