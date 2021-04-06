import { GetItemCommand, PutItemCommand, Status } from "../../deps.ts";
import {
  ALIAS_NAME_REGEX_TEST,
  DYNAMO_ALIAS_TABLE,
  DYNAMO_CLIENT,
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

  // @ts-ignore TS2339
  const { Item: item } = await DYNAMO_CLIENT.send(
    new GetItemCommand({
      TableName: DYNAMO_ALIAS_TABLE,
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
  const { $metadata: { httpStatusCode } } = await DYNAMO_CLIENT.send(
    new PutItemCommand({
      TableName: DYNAMO_ALIAS_TABLE,
      Item: {
        alias: { S: alias },
        secret: { S: secret },
        tags: { M: [] },
      },
    }),
  );

  if (httpStatusCode !== Status.OK) {
    return aliasFailed();
  }

  return json({ secret });
}
