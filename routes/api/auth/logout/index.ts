import { Handlers, Status } from "$fresh/server.ts";

import { AuthenticatedState } from "~/middlewares/authenticated.ts";

export const handler: Handlers<unknown, AuthenticatedState> = {
  async GET(req: Request, ctx) {
    const isHtml = req.headers.get("accept")?.includes("html");
    const redirect = req.headers.get("referer") ?? isHtml ? "/" : null;

    if (redirect != null) {
      return new Response(null, {
        status: Status.Found,
        headers: new Headers({
          "Location": redirect,
        }),
      });
    }

    await ctx.state.session.delete();
    return new Response(null, { status: Status.OK });
  },
};
