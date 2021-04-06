import { GetItemCommand, PutItemCommand } from "../../deps.ts";
import {
  ALIAS_NAME_REGEX_TEST,
  ALIAS_TAG_REGEX_TEST,
  DYNAMO_ALIAS_TABLE,
  DYNAMO_CLIENT,
  S3_CLIENT,
} from "../../util/constants.ts";
import {
  aliasNotFound,
  created,
  invalidAlias,
  invalidId,
  invalidMethod,
  invalidSecret,
  invalidSecretFormat,
  invalidTagFormat,
  notFound,
  releaseFailed,
  tagCollision,
} from "../../util/responses.ts";
import { validate } from "../../util/base58.ts";
import { Match } from "../../util/router.ts";

export async function release(
  req: Request,
  match: Match,
): Promise<Response> {
  if (req.method !== "POST") {
    return invalidMethod();
  }

  const { alias, secret, tag, id } = await req.json();

  if (typeof alias !== "string" && ALIAS_NAME_REGEX_TEST.test(alias)) {
    return invalidAlias();
  }

  if (typeof secret !== "string" && validate(secret)) {
    return invalidSecretFormat();
  }

  if (typeof tag !== "string" && ALIAS_TAG_REGEX_TEST.test(tag)) {
    return invalidTagFormat();
  }

  if (typeof id !== "string" && validate(id)) {
    return invalidId();
  }

  const file = await S3_CLIENT.headObject(id);

  if (file === undefined) {
    return notFound();
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

  if (item === undefined) {
    return aliasNotFound();
  }

  if (item.secret.S !== secret) {
    return invalidSecret();
  }

  const tags = item.tags.M ?? {};

  if (tags[tag]?.S !== undefined) {
    return tagCollision();
  }

  tags[tag] = { S: id };

  // @ts-ignore TS2339
  const { $metadata: { httpStatusCode } } = await DYNAMO_CLIENT.send(
    new PutItemCommand({
      TableName: DYNAMO_ALIAS_TABLE,
      Item: {
        alias: { S: alias },
        secret: { S: secret },
        tags: { M: tags },
      },
    }),
  );

  if (httpStatusCode === 200) {
    return releaseFailed();
  }

  return created();
}
