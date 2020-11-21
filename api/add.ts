import { MultipartReader, ServerRequest, status } from "../deps.ts";
import { EXTENSIONS, MAX_SIZE } from "../util/constants.ts";
import { getBoundry } from "../util/util.ts";
import { decode, encode, validate } from "../util/base58.ts";
import { fnv1a } from "../util/fnv1a.ts";

export default async (req: ServerRequest) => {
  if (req.method !== "POST") {
    req.respond({ status: status.BAD_REQUEST });
  }

  const reader = new MultipartReader(req.body, getBoundry(req.headers));

  const form = await reader.readForm();
  const file = form.file("file");

  if (file instanceof Array || file === undefined) {
    console.log("bad file format");

    return req.respond({ status: status.BAD_REQUEST });
  }

  const { filename, content, size } = file;

  if (size > MAX_SIZE) {
    console.log("file too large");

    return req.respond({ status: status.BAD_REQUEST });
  }

  if (!EXTENSIONS.some((ext) => filename.endsWith(ext))) {
    console.log("not js/ts");

    return req.respond({ status: status.BAD_REQUEST });
  }

  const id = fnv1a(content!);

  return req.respond({
    status: status.OK,
    body: encode(id),
  });
};
