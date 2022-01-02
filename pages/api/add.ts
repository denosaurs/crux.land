import { decode, HandlerContext, Status } from "../../server_deps.ts";
import {
  error,
  fileCollision,
  hashCollision,
  json,
} from "../../util/responses.ts";
import {
  CONTENT_TYPE_FROM_EXTENSION,
  EXTENSIONS,
  MAX_SIZE,
} from "../../util/constants.ts";
import { encode } from "../../util/base58.ts";
import { fnv1a } from "../../util/fnv1a.ts";
import { S3_CLIENT } from "../../util/clients.ts";
import { readToUint8Array, uint8ArraysEqual } from "../../util/util.ts";

export const handler = {
  async POST(ctx: HandlerContext): Promise<Response> {
    const file = await ctx.req.json();

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
  },
};
