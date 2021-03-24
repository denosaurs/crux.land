import { GetObjectResponse, S3Bucket, Status } from "../deps.ts";
import { Code } from "../pages/code.jsx";
import { validate } from "../util/base58.ts";
import {
  EXTENSION_FROM_CONTENT_TYPE,
  EXTENSIONS,
  S3_ACCESS_KEY_ID,
  S3_BUCKET,
  S3_REGION,
  S3_SECRET_ACCESS_KEY,
} from "../util/constants.ts";
import {
  fileNotFound,
  invalidExt,
  invalidId,
  invalidMethod,
  jsx,
} from "../util/responses.ts";
import { decodeUTF8, readToUint8Array } from "../util/util.ts";

function raw(
  file: GetObjectResponse,
  id: string,
  ext: string | undefined,
): Response {
  if (!ext) {
    return new Response(undefined, {
      status: Status.TemporaryRedirect,
      headers: new Headers({
        "Location": `./${id}.${
          EXTENSION_FROM_CONTENT_TYPE[
            file.contentType! as keyof typeof EXTENSION_FROM_CONTENT_TYPE
          ]
        }`,
      }),
    });
  } else {
    return new Response(file.body, {
      status: Status.OK,
      headers: new Headers({
        "Content-Type": `${file.contentType!}; charset=utf-8`,
      }),
    });
  }
}

async function formatted(
  file: GetObjectResponse,
  id: string,
  ext: string | undefined,
): Promise<Response> {
  const body = await readToUint8Array(file.body);
  const code = decodeUTF8(body);
  const language = EXTENSION_FROM_CONTENT_TYPE[
    file.contentType! as keyof typeof EXTENSION_FROM_CONTENT_TYPE
  ];

  return jsx(Code({ code, language }));
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

  if (ext !== undefined && !EXTENSIONS.some((valid) => valid === ext)) {
    return invalidExt();
  }

  const bucket = new S3Bucket({
    region: S3_REGION,
    accessKeyID: S3_ACCESS_KEY_ID,
    secretKey: S3_SECRET_ACCESS_KEY,
    bucket: S3_BUCKET,
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
