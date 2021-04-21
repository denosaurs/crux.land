import { GITHUB_CALLBACK_URL, GITHUB_CLIENT_ID } from "../util/constants.ts";
import { redirect } from "../util/responses.ts";
import { Match } from "../util/router.ts";

export function login(
  _req: Request,
  _match: Match,
): Response {
  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", GITHUB_CLIENT_ID);
  // url.searchParams.set("redirect_uri", encodeURIComponent("http://localhost:8080/api/login/callback"));

  if (GITHUB_CALLBACK_URL) {
    url.searchParams.set("redirect_uri", GITHUB_CALLBACK_URL);
  }

  return redirect(url.toString());
}
