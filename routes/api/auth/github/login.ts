import { HandlerContext, Handlers, Status } from "$fresh/server.ts";

import { config } from "~/config.ts";
import { createLoginState } from "~/utils/auth.ts";

export const handler: Handlers = {
  GET(req: Request, _ctx: HandlerContext) {
    const redirectUri = new URL(req.url).searchParams.get("redirect_uri");

    const resUrl = new URL("https://github.com/login/oauth/authorize");
    resUrl.searchParams.set("client_id", config.GITHUB_CLIENT_ID);

    if (config.GITHUB_CALLBACK_URL) {
      resUrl.searchParams.set("redirect_uri", config.GITHUB_CALLBACK_URL);
    }

    const redirect = redirectUri ?? req.headers.get("referer") ?? undefined;
    const state = createLoginState(redirect);
    resUrl.searchParams.set("state", state);

    return Response.redirect(resUrl, Status.Found);
  },
};
