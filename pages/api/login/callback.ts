import { HandlerContext, Status } from "../../../server_deps.ts";
import {
  couldNotAuthenticate,
  error,
  json,
  redirect,
} from "../../../util/responses.ts";
import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
} from "../../../util/backend_constants.ts";
import { createUser, getUser } from "../../../util/user.ts";

export const handler = {
  async GET(ctx: HandlerContext): Promise<Response> {
    const url = new URL(ctx.req.url);
    const code = url.searchParams.get("code");

    if (code === null) {
      return error("Invalid github code", Status.BadRequest);
    }

    const reqUrl = new URL(
      `https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${code}`,
    );
    reqUrl.searchParams.set("client_id", GITHUB_CLIENT_ID);
    reqUrl.searchParams.set("client_secret", GITHUB_CLIENT_SECRET);
    reqUrl.searchParams.set("code", code);

    const token = await (await fetch(reqUrl.toString(), {
      method: "POST",
      headers: {
        accept: "application/json",
      },
    })).json();

    if (token.error !== undefined) {
      return couldNotAuthenticate();
    }

    const { id, message }: { id: number; message?: string } =
      await (await fetch("https://api.github.com/user", {
        headers: {
          authorization: `token ${token.access_token}`,
          accept: "application/json",
        },
      })).json();

    if (message !== undefined) {
      return couldNotAuthenticate();
    }

    const user = await getUser(id) ?? await createUser(id);

    if (user !== undefined) {
      const accept = ctx.req.headers.get("accept");
      const isHtml = accept && accept.indexOf("html") >= 0;

      if (isHtml) {
        return redirect(
          `/?user=${encodeURIComponent(JSON.stringify(user))}`,
        );
      } else {
        return json(user);
      }
    }

    return error("Could not create user", Status.BadRequest);
  },
};
