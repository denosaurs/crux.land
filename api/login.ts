import { Status } from "../deps.ts";
import { GITHUB_CALLBACK_URL, GITHUB_CLIENT_ID } from "../util/constants.ts";
import { Match } from "../util/router.ts";

export function login(
  req: Request,
  match: Match,
): Response {
  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", GITHUB_CLIENT_ID);
  url.searchParams.set("redirect_uri", GITHUB_CALLBACK_URL);

  return new Response(undefined, {
    status: Status.TemporaryRedirect,
    headers: new Headers({
      "Location": url.toString(),
    }),
  });
}