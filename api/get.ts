import { S3Bucket, GetObjectResponse, ServerRequest, status } from "../deps.ts";
import { validate } from "../util/base58.ts";
import { EXTENSION_FROM_CONTENT_TYPE, EXTENSIONS } from "../util/constants.ts";
import {
  fileNotFound,
  invalidExt,
  invalidId,
  invalidMethod,
} from "../util/responses.ts";

type S3File = GetObjectResponse;

async function raw(
  req: ServerRequest,
  file: S3File,
  id: string,
  ext: string | undefined,
): Promise<void> {

  if (!ext) {
    return req.respond({
      status: status.TEMPORARY_REDIRECT,
      headers: new Headers({
        "Location": `./${id}.${EXTENSION_FROM_CONTENT_TYPE[file.contentType!]}`,
      }),
    });
  } else {
    return req.respond({
      status: status.OK,
      headers: new Headers({
        "Content-Type": `${file.contentType!}; charset=utf-8`,
      }),
      body: file.body,
    });
  }
}

async function formatted(
  req: ServerRequest,
  file: S3File,
  id: string,
  ext: string | undefined,
): Promise<void> {
  return req.respond({
    status: status.OK,
    headers: new Headers({
      "Content-Type": 'text/html; charset=utf-8',
    }),
    body: file.body,
  });
}

export default async function (req: ServerRequest): Promise<void> {
  if (req.method !== "GET") {
    return invalidMethod(req);
  }

  const accept = req.headers.get("accept");
  const isHtml = accept && accept.indexOf("html") >= 0;

  const url = new URL(req.url, "http://crux.land");
  const [id, ...rest] = url.pathname.split("/").pop()!.split(".");
  const ext = rest.pop();

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

  const file = await bucket.getObject(id);

  if (!file) {
    return fileNotFound(req);
  }

  if (isHtml) {
    return formatted(req, file, id, ext);
  } else {
    return raw(req, file, id, ext);
  }
}
