import { add } from "./api/add.ts";
import { getAlias, getId } from "./api/get.ts";
import { jsx, notFound } from "./util/responses.ts";
import { Index } from "./pages/index.tsx";
import { Api } from "./pages/api.tsx";
import { router } from "./util/router.ts";
import {
  ALIAS_PATH,
  EXTENSION_FROM_CONTENT_TYPE,
  ID_PATH,
  S3_ACCESS_KEY_ID,
  S3_BUCKET,
  S3_REGION,
  S3_SECRET_ACCESS_KEY,
} from "./util/constants.ts";
import { MatchResult, S3Bucket, Status } from "./deps.ts";
import { decodeUTF8, readToUint8Array } from "./util/util.ts";
import { Code } from "./pages/code.tsx";
import { request } from "./api/alias/request.ts";
import { release } from "./api/alias/release.ts";
import { getIdFromAlias } from "./util/alias.ts";

async function unknownHandler(
  req: Request,
  match: MatchResult,
): Promise<Response> {
  let { id } = match.params;
  const { alias, tag, ext } = match.params;
  const accept = req.headers.get("accept");
  const isHtml = accept && accept.indexOf("html") >= 0;

  if (isHtml) {
    if (alias !== undefined && tag !== undefined) {
      id = await getIdFromAlias(alias, tag);

      if (id === undefined) {
        return notFound();
      }
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

    const body = await readToUint8Array(file.body);
    const code = decodeUTF8(body);
    const language = EXTENSION_FROM_CONTENT_TYPE[
      file.contentType! as keyof typeof EXTENSION_FROM_CONTENT_TYPE
    ];

    return jsx(Code({ code, language }));
  } else {
    return new Response(undefined, {
      status: Status.TemporaryRedirect,
      headers: new Headers({
        "Location": `/api/get${match.path}`,
      }),
    });
  }
}

addEventListener("fetch", (e: any) => {
  e.respondWith(
    router({
      "/": (_req) => jsx(Index()),
      "/api": (_req) => jsx(Api()),
      "/api/add": add,
      "/api/alias/request": request,
      "/api/alias/release": release,
      [`/api/get/${ID_PATH}`]: getId,
      [`/api/get/${ALIAS_PATH}`]: getAlias,
      [`/${ID_PATH}`]: unknownHandler,
      [`/${ALIAS_PATH}`]: unknownHandler,
    }, (req) => {
      return notFound();
    })(e.request),
  );
});
