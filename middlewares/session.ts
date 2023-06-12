import { getCookies } from "$std/http/cookie.ts";
import { MiddlewareHandlerContext } from "$fresh/server.ts";

import { deleteSession, readSession, Session } from "~/models/session.ts";

export interface SessionState {
  session?: Session & {
    get valid(): boolean;
    delete(): Promise<void>;
  };
}

export function session() {
  return async (req: Request, ctx: MiddlewareHandlerContext<SessionState>) => {
    const cookies = getCookies(req.headers);
    const bearer = req.headers.get("Authorization")?.match(/Bearer\s(.*)/)?.[1];
    const now = new Date();

    if ("session" in cookies || bearer != null) {
      const id = cookies["session"] ?? bearer;
      const session = await readSession(id);

      if (session != null) {
        ctx.state.session = {
          ...session,
          get valid() {
            return !session.expires || session.expires <= now;
          },
          async delete() {
            await deleteSession(session);
            delete ctx.state.session;
          },
        };
      }
    }

    return ctx.next();
  };
}
