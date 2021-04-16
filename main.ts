import { add } from "./api/add.ts";
import { getAlias, getId } from "./api/get.ts";
import { jsx, notFound } from "./util/responses.ts";
import { Index } from "./pages/index.tsx";
import { Api } from "./pages/api.tsx";
import { Admin } from "./pages/admin.tsx";
import { Alias } from "./pages/alias.tsx";
import { Match, router } from "./util/router.ts";
import {
  ALIAS_NAME_REGEX,
  ALIAS_PATH,
  EXTENSION_FROM_CONTENT_TYPE,
  ID_PATH,
  S3_ACCESS_KEY_ID,
  S3_BUCKET,
  S3_REGION,
  S3_SECRET_ACCESS_KEY,
} from "./util/constants.ts";
import { S3Bucket, Status } from "./deps.ts";
import { decodeUTF8, readToUint8Array } from "./util/util.ts";
import { Code } from "./pages/code.tsx";
import { request } from "./api/alias/request.ts";
import { release } from "./api/alias/release.ts";
import { getIdFromAlias } from "./util/alias.ts";
import { login } from "./api/login.ts";
import { callback } from "./api/login/callback.ts";
import {
  completionsAlias,
  completionsSchema,
  completionsTags,
} from "./api/completions.ts";

async function unknownHandler(
  req: Request,
  match: Match,
): Promise<Response> {
  let { id } = match.params;
  const { alias, tag, ext } = match.params;
  const accept = req.headers.get("accept");
  const isHtml = accept && accept.indexOf("html") >= 0;

  if (isHtml) {
    if (alias !== undefined && tag !== undefined) {
      id = await getIdFromAlias(alias, tag);
    }

    if (id === undefined) {
      return notFound();
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

addEventListener("fetch", (event: FetchEvent) => {
  event.respondWith(
    router({
      "/": (_req) => jsx(Index()),
      "/admin": (_req) => jsx(Admin()),
      "/alias": (_req) => jsx(Alias()),
      "/api": (_req) => jsx(Api()),
      "/api/login": login,
      "/api/login/callback": callback,
      "/api/add": add,
      "/api/alias/request": request,
      "/api/alias/release": release,
      "/api/completions": completionsAlias,
      [`/api/completions/:alias(${ALIAS_NAME_REGEX.source})/tags`]:
        completionsTags,
      [`/api/get/${ID_PATH}`]: getId,
      [`/api/get/${ALIAS_PATH}`]: getAlias,
      [`/${ID_PATH}`]: unknownHandler,
      [`/${ALIAS_PATH}`]: unknownHandler,
      "/.well-known/deno-import-intellisense.json": completionsSchema,
    }, (req) => {
      return notFound();
    })(event.request),
  );
});
