import { Handlers, Status } from "$fresh/server.ts";

import { SessionState } from "../../../middlewares/session.ts";

export const handler: Handlers<unknown, SessionState> = {
  // deno-lint-ignore require-await
  async POST(req: Request, ctx) {
    const author = ctx.state.session?.valid ? ctx.state.session.user : null;
  },
};
