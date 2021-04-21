import { decode, Status } from "../deps.ts";
import {
  CONTENT_TYPE_FROM_EXTENSION,
  EXTENSIONS,
  MAX_SIZE,
} from "../util/constants.ts";
import { readToUint8Array, uint8ArraysEqual } from "../util/util.ts";
import { encode } from "../util/base58.ts";
import { fnv1a } from "../util/fnv1a.ts";
import {
  error,
  fileCollision,
  hashCollision,
  invalidMethod,
  json,
} from "../util/responses.ts";
import { Match } from "../util/router.ts";
import { S3_CLIENT } from "../util/clients.ts";

export async function add(
  req: Request,
  _match: Match,
): Promise<Response> {
  if (req.method !== "POST") {
    return invalidMethod();
  }

  const file = await req.json();

  if (
    typeof file.content !== "string" ||
    typeof file.name !== "string"
  ) {
    return error("Bad file format", Status.BadRequest);
  }

  const content = decode(file.content);

  if (content.byteLength > MAX_SIZE) {
    return error("File too large", Status.BadRequest);
  }

  if (!EXTENSIONS.some((valid) => valid === file.name.split(".").pop()!)) {
    return error("Invalid extension", Status.BadRequest);
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
