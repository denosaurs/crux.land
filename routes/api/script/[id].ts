import { Handlers, Status } from "$fresh/server.ts";

import { SessionState } from "~/middlewares/session.ts";
import { getScript } from "~/models/script.ts";

export const handler: Handlers<{ id: string }, SessionState> = {
  async GET(_req, ctx) {
    const script = await getScript(ctx.params.id);

    if (script == null) {
      return Response.json({
        message: `Could not find script with id ${ctx.params.id}`,
      }, {
        status: Status.NotFound,
      });
    }

    return Response.json(script, { status: Status.OK });
  },
};
