import { MiddlewareHandlerContext, Status } from "$fresh/server.ts";

import { Session } from "~/models/session.ts";

export interface AuthenticatedState {
  session: Session & {
    get valid(): true;
    delete(): Promise<void>;
  };
}

export function authenticated(
  unauthenticated = () => new Response(null, { status: Status.Unauthorized }),
) {
  return (_req: Request, ctx: MiddlewareHandlerContext<AuthenticatedState>) => {
    if (!ctx.state.session?.valid) {
      return unauthenticated();
    }

    return ctx.next();
  };
}
