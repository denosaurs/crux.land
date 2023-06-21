import { Handlers, Status } from "$fresh/server.ts";

import { SessionState } from "~/middlewares/session.ts";
import { listScripts } from "~/models/script.ts";

export const handler: Handlers<unknown, SessionState> = {
  async GET(_req, _ctx) {
    const scripts = await listScripts();
    return Response.json(
      scripts.map(({ id, author, extension, contentType }) => ({
        id,
        author,
        extension,
        contentType,
      })),
      { status: Status.OK },
    );
  },
};
