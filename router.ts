// Copyright 2021 denosaurs. All rights reserved. MIT license.

import { match } from "https://cdn.skypack.dev/path-to-regexp@6.2.0?dts";

export interface Match {
  path: string;
  index: number;
  params: Record<string, string | undefined>;
}

export type RequestHandler = (req: Request) => Response | Promise<Response>;

export type MatchHandler = (
  req: Request,
  match: Match,
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
        return handler(req, res as Match);
      }
    }

    return other(req);
  };
}
