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

export function fileTooLarge(): Response {
  return new Response("File too large", { status: Status.BadRequest });
}

export function badFileFormat(): Response {
  return new Response("Bad file format", { status: Status.BadRequest });
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
