import { decode, Status } from "../deps.ts";
import {
  CONTENT_TYPE_FROM_EXTENSION,
  EXTENSIONS,
  MAX_SIZE,
  S3_CLIENT,
} from "../util/constants.ts";
import { readToUint8Array, uint8ArraysEqual } from "../util/util.ts";
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
import { Match } from "../util/router.ts";

export async function add(
  req: Request,
  match: Match,
): Promise<Response> {
  if (req.method !== "POST") {
    return invalidMethod();
  }

  const file = await req.json();

  if (
    typeof file.content !== "string" ||
    typeof file.name !== "string"
  ) {
    return badFileFormat();
  }

  const content = decode(file.content);

  if (content.byteLength > MAX_SIZE) {
    return fileTooLarge();
  }

  if (!EXTENSIONS.some((valid) => valid === file.name.split(".").pop()!)) {
    return invalidExt();
  }

  const id = encode(fnv1a(content));
  const ext = file.name.split(".").pop()! as typeof EXTENSIONS[number];
  const contentType = CONTENT_TYPE_FROM_EXTENSION[ext];

  const script = await S3_CLIENT.headObject(id);
  if (script !== undefined) {
    const object = (await S3_CLIENT.getObject(id))!;
    const body = await readToUint8Array(object.body);
    if (uint8ArraysEqual(content, body)) {
      return fileCollision(id);
    }

    console.log("collision", id);
    return hashCollision(id);
  }

  await S3_CLIENT.putObject(id, content, { contentType });

  return json({ id }, { status: Status.Created });
}
