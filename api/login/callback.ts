import { Status } from "../../deps.ts";
import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
} from "../../util/constants.ts";
import { authError, invalidGithubCode } from "../../util/responses.ts";
import { Match } from "../../util/router.ts";

export async function callback(
  req: Request,
  match: Match,
): Promise<Response> {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (code === null) {
    return invalidGithubCode();
  }

  const reqUrl = new URL("https://github.com/login/oauth/access_token");
  reqUrl.searchParams.set("client_id", GITHUB_CLIENT_ID);
  reqUrl.searchParams.set("client_secret", GITHUB_CLIENT_SECRET);
  reqUrl.searchParams.set("code", code);

  const token = await (await fetch(reqUrl, {
    method: "POST",
    headers: {
      accept: "application/json",
    },
  })).json();

  if (token.error !== undefined) {
    return authError(token);
  }

  const user = await (await fetch("https://api.github.com/user", {
    headers: {
      authorization: `token ${token.access_token}`,
      accept: "application/json",
    },
  })).json();

  if (user.message !== undefined) {
    return authError(token);
  }

  return new Response(undefined, {
    status: Status.OK,
  });
}
