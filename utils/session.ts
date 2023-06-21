import { setCookie } from "$std/http/cookie.ts";

import { development } from "~/config.ts";
import { Session } from "~/models/session.ts";

export function setSessionCookie(headers: Headers, session: Session): Headers {
  setCookie(headers, {
    name: "session",
    value: session.id,
    expires: session.expires,
    secure: !development,
    httpOnly: true,
    sameSite: "Strict",
    path: "/",
  });
  return headers;
}

export function expireSessionCookie(headers: Headers): Headers {
  setCookie(headers, {
    name: "session",
    value: "",
    maxAge: 0,
    secure: !development,
    httpOnly: true,
    sameSite: "Strict",
    path: "/",
  });
  return headers;
}
