import { status } from "../deps.ts";

export function invalidMethod(): Response {
  return new Response("Invalid method", { status: status.BAD_REQUEST });
}

export function invalidId(): Response {
  return new Response("Invalid id", { status: status.BAD_REQUEST });
}

export function invalidExt(): Response {
  return new Response("Invalid extension", { status: status.BAD_REQUEST });
}

export function fileTooLarge(): Response {
  return new Response("File too large", { status: status.BAD_REQUEST });
}

export function badFileFormat(): Response {
  return new Response("Bad file format", { status: status.BAD_REQUEST });
}

export function fileCollision(
  id: string,
): Response {
  return new Response(`File already exists (${id})`, {
    status: status.BAD_REQUEST,
  });
}

export function hashCollision(
  id: string,
): Response {
  return new Response(
    `Hash collided, try changing your file slightly (${id})`,
    {
      status: status.BAD_REQUEST,
    },
  );
}

export function fileNotFound(): Response {
  return new Response("File not found", { status: status.NOT_FOUND });
}
