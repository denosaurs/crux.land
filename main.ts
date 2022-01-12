import { add } from "./api/add.ts";
import { getAlias, getId } from "./api/get.ts";
import { notFound, redirect } from "./util/responses.ts";
import { Index } from "./pages/index.tsx";
import { Api } from "./pages/api.tsx";
import { Admin } from "./pages/admin.tsx";
import { Alias } from "./pages/alias.tsx";
import {
  ALIAS_NAME_REGEX,
  ALIAS_PATH,
  EXTENSION_FROM_CONTENT_TYPE,
  ID_PATH,
} from "./util/constants.ts";
import { Match, router, serve } from "./deps.ts";
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
import { approve } from "./api/alias/approve.ts";
import { deny } from "./api/alias/deny.ts";
import { requests } from "./api/alias/requests.ts";
import { list } from "./api/alias/list.ts";
import { S3_CLIENT } from "./util/clients.ts";
import { jsx } from "./util/jsx.ts";
import { Head } from "./components/head.tsx";

async function unknownHandler(
  req: Request,
  match: Match,
): Promise<Response> {
  let { id } = match.params;
  const { alias, tag } = match.params;
  const accept = req.headers.get("accept");
  const isHtml = accept && accept.indexOf("html") >= 0;

  if (isHtml) {
    if (alias !== undefined && tag !== undefined) {
      id = await getIdFromAlias(alias, tag);
    }

    if (id === undefined) {
      return notFound();
    }

    const file = await S3_CLIENT.getObject(id);

    if (file === undefined) {
      return notFound();
    }

    const body = await readToUint8Array(file.body);
    const code = decodeUTF8(body);
    const language = EXTENSION_FROM_CONTENT_TYPE[
      file.contentType! as keyof typeof EXTENSION_FROM_CONTENT_TYPE
    ];

    return jsx(Code({ code, language }), Head());
  } else {
    return redirect(`/api/get${match.path}`);
  }
}

serve(router({
  "/": (_req) => jsx(Index(), Head()),
  "/admin": (_req) => jsx(Admin(), Head()),
  "/alias": (_req) => jsx(Alias(), Head()),
  "/api": (_req) => jsx(Api(), Head()),
  "/api/login": login,
  "/api/login/callback": callback,
  "/api/add": add,
  "/api/alias/request": request,
  "/api/alias/release": release,
  "/api/alias/requests": requests,
  "/api/alias/approve": approve,
  "/api/alias/deny": deny,
  "/api/alias/list": list,
  "/api/completions": completionsAlias,
  [`/api/completions/:alias(${ALIAS_NAME_REGEX.source})/tags`]: completionsTags,
  [`/api/get/${ID_PATH}`]: getId,
  [`/api/get/${ALIAS_PATH}`]: getAlias,
  [`/${ID_PATH}`]: unknownHandler,
  [`/${ALIAS_PATH}`]: unknownHandler,
  "/.well-known/deno-import-intellisense.json": completionsSchema,
}, (_req) => {
  return notFound();
}));
