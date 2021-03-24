import { MatchResult, S3Bucket } from "../deps.ts";
import {
  CONTENT_TYPE_FROM_EXTENSION,
  EXTENSIONS,
  MAX_SIZE,
  S3_ACCESS_KEY_ID,
  S3_BUCKET,
  S3_REGION,
  S3_SECRET_ACCESS_KEY,
} from "../util/constants.ts";
import {
  encodeUTF8,
  readToUint8Array,
  uint8ArraysEqual,
} from "../util/util.ts";
import { encode } from "../util/base58.ts";
import { fnv1a } from "../util/fnv1a.ts";
import {
  badFileFormat,
  fileCollision,
  fileTooLarge,
  hashCollision,
  invalidExt,
  invalidMethod,
  json,
} from "../util/responses.ts";

export async function add(
  req: Request,
  _match: MatchResult,
): Promise<Response> {
  if (req.method !== "POST") {
    return invalidMethod();
  }

  const file = await req.json();

  if (
    file instanceof Array || file === undefined || file.content === undefined ||
    file.name === undefined
  ) {
    return badFileFormat();
  }

  const content = encodeUTF8(file.content);
  const size = content.byteLength;

  if (size > MAX_SIZE) {
    return fileTooLarge();
  }

  if (!EXTENSIONS.some((valid) => valid === file.name.split(".").pop()!)) {
    return invalidExt();
  }

  const id = encode(fnv1a(content));
  const ext = file.name.split(".").pop()! as typeof EXTENSIONS[number];
  const contentType = CONTENT_TYPE_FROM_EXTENSION[ext];
  const bucket = new S3Bucket({
    region: S3_REGION,
    accessKeyID: S3_ACCESS_KEY_ID,
    secretKey: S3_SECRET_ACCESS_KEY,
    bucket: S3_BUCKET,
  });

  const script = await bucket.headObject(id);
  if (script !== undefined) {
    const object = (await bucket.getObject(id))!;
    const body = await readToUint8Array(object.body);
    if (uint8ArraysEqual(content, body)) {
      return fileCollision(id);
    }

    console.log("collision", id);
    return hashCollision(id);
  }

  await bucket.putObject(id, content, { contentType });

  return json({ id });
}
