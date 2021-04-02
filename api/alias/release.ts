import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  S3Bucket,
} from "../../deps.ts";
import {
  ALIAS_NAME_REGEX_TEST,
  ALIAS_TAG_REGEX_TEST,
  DYNAMO_ACCESS_KEY_ID,
  DYNAMO_REGION,
  DYNAMO_SECRET_ACCESS_KEY,
  DYNAMO_TABLE,
  S3_ACCESS_KEY_ID,
  S3_BUCKET,
  S3_REGION,
  S3_SECRET_ACCESS_KEY,
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

  const bucket = new S3Bucket({
    region: S3_REGION,
    accessKeyID: S3_ACCESS_KEY_ID,
    secretKey: S3_SECRET_ACCESS_KEY,
    bucket: S3_BUCKET,
  });

  const file = await bucket.headObject(id);

  if (file === undefined) {
    return notFound();
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
  const { $metadata: { httpStatusCode } } = await client.send(
    new PutItemCommand({
      TableName: DYNAMO_TABLE,
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
