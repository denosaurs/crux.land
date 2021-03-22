import { GetObjectResponse, S3Bucket, status } from "../deps.ts";
import { validate } from "../util/base58.ts";
import { EXTENSION_FROM_CONTENT_TYPE, EXTENSIONS } from "../util/constants.ts";
import {
  fileNotFound,
  invalidExt,
  invalidId,
  invalidMethod,
} from "../util/responses.ts";
import { renderCode } from "../templates/code.ts";

type S3File = GetObjectResponse;
const decoder = new TextDecoder();

function raw(file: S3File, id: string, ext: string | undefined): Response {
  if (!ext) {
    return new Response(undefined, {
      status: status.TEMPORARY_REDIRECT,
      headers: new Headers({
        "Location": `./${id}.${EXTENSION_FROM_CONTENT_TYPE[file.contentType!]}`,
      }),
    });
  } else {
    return new Response(file.body, {
      status: status.OK,
      headers: new Headers({
        "Content-Type": `${file.contentType!}; charset=utf-8`,
      }),
    });
  }
}

function formatted(
  file: S3File,
  id: string,
  ext: string | undefined,
): Response {
  const code = decoder.decode(file.body);
  return new Response(renderCode(code, id, ext), {
    status: status.OK,
    headers: new Headers({
      "Content-Type": "text/html; charset=utf-8",
    }),
  });
}

export async function get(req: Request): Promise<Response> {
  if (req.method !== "GET") {
    return invalidMethod();
  }

  const accept = req.headers.get("accept");
  const isHtml = accept && accept.indexOf("html") >= 0;

  const url = new URL(req.url, "http://crux.land");
  const [id, ...rest] = url.pathname.split("/").pop()!.split(".");
  const ext = rest.pop();

  if (!id || !validate(id)) {
    return invalidId();
  }

  if (ext && !EXTENSIONS.some((valid) => valid === ext)) {
    return invalidExt();
  }

  const bucket = new S3Bucket({
    region: Deno.env.get("S3_REGION")!,
    accessKeyID: Deno.env.get("S3_ACCESS_KEY_ID")!,
    secretKey: Deno.env.get("S3_SECRET_KEY")!,
    bucket: Deno.env.get("S3_BUCKET")!,
  });

  const file = await bucket.getObject(id);

  if (!file) {
    return fileNotFound();
  }

  if (isHtml) {
    return formatted(file, id, ext);
  } else {
    return raw(file, id, ext);
  }
}
