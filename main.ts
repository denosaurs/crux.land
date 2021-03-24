import { add } from "./api/add.ts";
import { get } from "./api/get.ts";
import { jsx, notFound } from "./util/responses.ts";
import { Index } from "./pages/index.jsx";
import { MatchHandler, router } from "./util/router.ts";
import {
  BASE58_ALPHABET,
  EXTENSION_FROM_CONTENT_TYPE,
  EXTENSIONS,
  MAX_LEN,
  MIN_LEN,
  S3_ACCESS_KEY_ID,
  S3_BUCKET,
  S3_REGION,
  S3_SECRET_ACCESS_KEY,
} from "./util/constants.ts";
import { MatchResult, S3Bucket, Status } from "./deps.ts";
import { decodeUTF8, readToUint8Array } from "./util/util.ts";
import { Code } from "./pages/code.jsx";

const idPath = `:id([${BASE58_ALPHABET}]{${MIN_LEN},${MAX_LEN}}):ext((?:\\.(?:${
  EXTENSIONS.join("|")
}))?)`;

async function idHandler(
  req: Request,
  match: MatchResult,
): Promise<Response> {
  const { id, ext } = match.params;
  const accept = req.headers.get("accept");
  const isHtml = accept && accept.indexOf("html") >= 0;

  if (isHtml) {
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
        "Location": `./api/get/${id}${ext}`,
      }),
    });
  }
}

const routes: Record<string, MatchHandler> = {
  "/api/add": add,
  "/": (_req) => jsx(Index()),
};
routes[`/api/get/${idPath}`] = get;
routes[`/${idPath}`] = idHandler;

addEventListener("fetch", (e: any) => {
  e.respondWith(
    router(routes, (req) => {
      return notFound();
    })(e.request),
  );
});
