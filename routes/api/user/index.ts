import { Handlers, Status } from "$fresh/server.ts";

import { AuthenticatedState } from "~/middlewares/authenticated.ts";
import { readUser } from "~/models/user.ts";

export const handler: Handlers<unknown, AuthenticatedState> = {
  async GET(_req: Request, ctx) {
    const user = await readUser(ctx.state.session.user);

    if (user == null) {
      await ctx.state.session.delete();
      return new Response(null, { status: Status.NotFound });
    }

    return Response.json(user, { status: Status.OK });
  },
};
