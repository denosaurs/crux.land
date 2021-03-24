import { MatchResult, S3Bucket, Status } from "../deps.ts";
import {
  EXTENSION_FROM_CONTENT_TYPE,
  S3_ACCESS_KEY_ID,
  S3_BUCKET,
  S3_REGION,
  S3_SECRET_ACCESS_KEY,
} from "../util/constants.ts";
import { invalidMethod, notFound } from "../util/responses.ts";

export async function get(req: Request, match: MatchResult): Promise<Response> {
  if (req.method !== "GET") {
    return invalidMethod();
  }

  const { id, ext } = match.params;

  if (ext === "") {
    const bucket = new S3Bucket({
      region: S3_REGION,
      accessKeyID: S3_ACCESS_KEY_ID,
      secretKey: S3_SECRET_ACCESS_KEY,
      bucket: S3_BUCKET,
    });

    const file = await bucket.headObject(id);

    if (file === undefined) {
      return notFound();
    }

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
  }

  const bucket = new S3Bucket({
    region: S3_REGION,
    accessKeyID: S3_ACCESS_KEY_ID,
    secretKey: S3_SECRET_ACCESS_KEY,
    bucket: S3_BUCKET,
  });

  const file = await bucket.getObject(id);

  if (file === undefined) {
    return notFound();
  }

  return new Response(file.body, {
    status: Status.OK,
    headers: new Headers({
      "Content-Type": `${file.contentType!}; charset=utf-8`,
    }),
  });
}
