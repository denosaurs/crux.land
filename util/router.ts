import { match, MatchResult } from "../deps.ts";

export type RequestHandler = (req: Request) => Response | Promise<Response>;
export type MatchHandler = (
  req: Request,
  match: MatchResult,
) => Response | Promise<Response>;

export function router(
  routes: Record<
    string,
    MatchHandler
  >,
  other: RequestHandler,
): RequestHandler {
  return (req) => {
    for (const [path, handler] of Object.entries(routes)) {
      const res = match(path)(new URL(req.url).pathname);

      if (res !== false) {
        return handler(req, res);
      }
    }

    return other(req);
  };
}
