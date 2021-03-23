import {
  MultipartReader,
  readerFromStreamReader,
  S3Bucket,
  Status,
} from "../deps.ts";
import {
  CONTENT_TYPE_FROM_EXTENSION,
  EXTENSIONS,
  MAX_SIZE,
} from "../util/constants.ts";
import {
  getMimeBoundry,
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

export async function add(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return invalidMethod();
  }

  const reader = new MultipartReader(
    readerFromStreamReader(req.body!.getReader()),
    getMimeBoundry(req.headers)!,
  );

  const form = await reader.readForm();
  const file = form.file("file");

  if (
    file instanceof Array || file === undefined || file.content === undefined
  ) {
    return badFileFormat();
  }

  if (file.size > MAX_SIZE) {
    return fileTooLarge();
  }

  if (!EXTENSIONS.some((valid) => valid === file.filename.split(".").pop()!)) {
    return invalidExt();
  }

  const id = encode(fnv1a(file.content));
  const ext = file.filename.split(".").pop()! as typeof EXTENSIONS[number];
  const contentType = CONTENT_TYPE_FROM_EXTENSION[ext];
  const bucket = new S3Bucket({
    region: Deno.env.get("S3_REGION")!,
    accessKeyID: Deno.env.get("S3_ACCESS_KEY_ID")!,
    secretKey: Deno.env.get("S3_SECRET_KEY")!,
    bucket: Deno.env.get("S3_BUCKET")!,
  });

  const script = await bucket.headObject(id);
  if (script !== undefined) {
    const object = (await bucket.getObject(id))!;
    const body = await readToUint8Array(object.body);
    if (uint8ArraysEqual(file.content, body)) {
      return fileCollision(id);
    }

    console.log("collision", id);
    return hashCollision(id);
  }

  await bucket.putObject(id, file.content, { contentType });

  return json({ id });
}
