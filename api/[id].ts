import { S3Bucket, ServerRequest, status } from "../deps.ts";
import { decode, validate } from "../util/base58.ts";

export default async (req: ServerRequest) => {
  if (req.method !== "GET") {
    req.respond({ status: status.BAD_REQUEST });
  }

  const url = new URL(req.url, "http://crux.land");
  console.log("url", url);
  const urlId = url.pathname.split("/").pop()!;

  console.log("id", urlId);
  console.log("validId", validate(urlId));

  if (!urlId || !validate(urlId)) {
    return req.respond({ status: status.BAD_REQUEST });
  }

  const bucket = new S3Bucket({
    region: Deno.env.get("S3_REGION")!,
    accessKeyID: Deno.env.get("S3_ACCESS_KEY_ID")!,
    secretKey: Deno.env.get("S3_SECRET_KEY")!,
    bucket: Deno.env.get("S3_BUCKET")!,
  });

  const file = await bucket.getObject(decode(urlId).toString());

  if (!file) {
    return req.respond({ status: status.BAD_REQUEST });
  }

  return req.respond({
    status: status.OK,
    headers: new Headers({
      "Content-Type": `${file.contentType!}; charset=utf-8`,
    }),
    body: file.body,
  });
};
