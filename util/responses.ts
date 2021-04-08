import { preact, render, Status, STATUS_TEXT } from "../deps.ts";

export function invalidMethod(): Response {
  return new Response("Invalid method", { status: Status.BadRequest });
}

export function invalidId(): Response {
  return new Response("Invalid id", { status: Status.BadRequest });
}

export function invalidExt(): Response {
  return new Response("Invalid extension", { status: Status.BadRequest });
}

export function invalidAlias(): Response {
  return new Response("Invalid alias", { status: Status.BadRequest });
}

export function aliasCollision(): Response {
  return new Response("Alias already exists", { status: Status.BadRequest });
}

export function aliasFailed(): Response {
  return new Response("Alias request failed", { status: Status.BadRequest });
}

export function aliasNotFound(): Response {
  return new Response("Alias not found", { status: Status.BadRequest });
}

export function invalidSecret(): Response {
  return new Response("Invalid secret", { status: Status.BadRequest });
}

export function invalidSecretFormat(): Response {
  return new Response("Invalid secret format", { status: Status.BadRequest });
}

export function invalidTagFormat(): Response {
  return new Response("Invalid tag format", { status: Status.BadRequest });
}

export function invalidGithubCode(): Response {
  return new Response("Invalid github code", { status: Status.BadRequest });
}

export function authError(err: unknown): Response {
  return json(err, { status: Status.BadRequest });
}

export function couldNotCreateUser(): Response {
  return new Response("Could not create user", { status: Status.BadRequest });
}

export function tagCollision(): Response {
  return new Response("tag already exists", { status: Status.BadRequest });
}

export function releaseFailed(): Response {
  return new Response("Release failed", { status: Status.BadRequest });
}

export function fileTooLarge(): Response {
  return new Response("File too large", { status: Status.BadRequest });
}

export function badFileFormat(): Response {
  return new Response("Bad file format", { status: Status.BadRequest });
}

export function created(): Response {
  return new Response(undefined, { status: Status.Created });
}

export function fileCollision(
  id: string,
): Response {
  return new Response(`File already exists (${id})`, {
    status: Status.BadRequest,
  });
}

export function hashCollision(
  id: string,
): Response {
  return new Response(
    `Hash collided, try changing your file slightly (${id})`,
    {
      status: Status.BadRequest,
    },
  );
}

export function notFound(): Response {
  return new Response("Not found", { status: Status.NotFound });
}

export function html(html: string, init?: ResponseInit): Response {
  return new Response(html, {
    statusText: init?.statusText ?? STATUS_TEXT.get(init?.status ?? Status.OK),
    status: init?.status ?? Status.OK,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      ...init?.headers,
    },
  });
}

export function jsx(jsx: preact.VNode, init?: ResponseInit): Response {
  return html(render(jsx), init);
}

export function json(obj: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(obj), {
    statusText: init?.statusText ?? STATUS_TEXT.get(init?.status ?? Status.OK),
    status: init?.status ?? Status.OK,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...init?.headers,
    },
  });
}
