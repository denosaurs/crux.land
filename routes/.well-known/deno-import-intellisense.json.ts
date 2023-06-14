import { Handlers, Status } from "$fresh/server.ts";

import { SessionState } from "~/middlewares/session.ts";
import { getScript } from "~/models/script.ts";

export const handler: Handlers<unknown, SessionState> = {
  async GET(_req, _ctx) {
    return Response.json({});
  },
};
