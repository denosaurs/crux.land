import { Status } from "../deps.ts";

export function invalidMethod(): Response {
  return error("Invalid method", Status.BadRequest);
}

export function invalidAlias(): Response {
  return error("Invalid alias", Status.BadRequest);
}

export function aliasNotFound(): Response {
  return error("Alias not found", Status.BadRequest);
}

export function couldNotAuthenticate(): Response {
  return error("Could not authenticate", Status.Unauthorized);
}

export function error(error: unknown, status: number): Response {
  return json({ error }, { status });
}

export function status(status: number): Response {
  return new Response(undefined, { status });
}

export function ok(): Response {
  return status(Status.OK);
}

export function created(): Response {
  return status(Status.Created);
}

export function fileCollision(
  id: string,
): Response {
  return error(`File already exists (${id})`, Status.BadRequest);
}

export function hashCollision(
  id: string,
): Response {
  return error(
    `Hash collided, try changing your file slightly (${id})`,
    Status.InternalServerError,
  );
}

export function notFound(): Response {
  return new Response("Not found", { status: Status.NotFound });
}

export function html(html: string, init?: ResponseInit): Response {
  return new Response(html, {
    status: init?.status ?? Status.OK,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      ...init?.headers,
    },
  });
}

export function json(obj: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(obj), {
    status: init?.status ?? Status.OK,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...init?.headers,
    },
  });
}

export function redirect(location: string): Response {
  return new Response(undefined, {
    status: Status.TemporaryRedirect,
    headers: new Headers({
      "Location": location,
    }),
  });
}
