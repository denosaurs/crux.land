import { S3Bucket, ServerRequest, status } from "../deps.ts";
import { decode, validate } from "../util/base58.ts";
import { EXTENSION_FROM_CONTENT_TYPE, EXTENSIONS } from "../util/constants.ts";
import { fileNotFound, invalidExt, invalidId } from "../util/responses.ts";

export default async (req: ServerRequest) => {
  if (req.method !== "GET") {
    req.respond({ status: status.BAD_REQUEST });
  }

  const url = new URL(req.url, "http://crux.land");
  console.log("url", url);
  const [id, ext] = url.pathname.split("/").pop()!.split(".");

  console.log("id", id);
  console.log("ext", ext);

  if (!id || !validate(id)) {
    return invalidId(req);
  }

  if (ext && !EXTENSIONS.some((valid) => valid === ext)) {
    return invalidExt(req);
  }

  const bucket = new S3Bucket({
    region: Deno.env.get("S3_REGION")!,
    accessKeyID: Deno.env.get("S3_ACCESS_KEY_ID")!,
    secretKey: Deno.env.get("S3_SECRET_KEY")!,
    bucket: Deno.env.get("S3_BUCKET")!,
  });

  const file = await bucket.getObject(decode(id).toString());

  if (!file) {
    return fileNotFound(req);
  }

  const headers = new Headers({
    "Content-Type": `${file.contentType!}; charset=utf-8`,
  });
  const body = file.body;

  if (!ext) {
    headers.append(
      "Location",
      `./${id}${EXTENSION_FROM_CONTENT_TYPE[file.contentType!]}`,
    );

    return req.respond({
      status: status.TEMPORARY_REDIRECT,
      headers,
      body,
    });
  } else {
    return req.respond({
      status: status.OK,
      headers,
      body,
    });
  }
};
