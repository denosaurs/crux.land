import { Handlers, Status } from "$fresh/server.ts";

import { AuthenticatedState } from "~/middlewares/authenticated.ts";

export const handler: Handlers<unknown, AuthenticatedState> = {
  async GET(_req: Request, ctx) {
    await ctx.state.session.delete();
    return new Response(null, { status: Status.OK });
  },
};
