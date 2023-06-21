import { HandlerContext, Handlers, Status } from "$fresh/server.ts";

import { createUser, getUser } from "~/models/user.ts";
import { createSession } from "~/models/session.ts";

import { loginState } from "~/utils/auth.ts";
import { fetchAccessToken, fetchUserData } from "~/utils/github.ts";
import { setSessionCookie } from "~/utils/session.ts";

export const handler: Handlers = {
  async GET(req: Request, _ctx: HandlerContext) {
    const searchParams = new URL(req.url).searchParams;
    const code = searchParams.get("code");
    const state = searchParams.has("state")
      ? loginState.take(searchParams.get("state")!)
      : null;

    if (!code || !state) {
      return Response.json(
        { message: "Invalid or missing code or state search parameter" },
        { status: Status.BadRequest },
      );
    }

    const { redirect } = state;

    const accessToken = await fetchAccessToken(code);
    const userData = await fetchUserData(accessToken);

    let created = false;
    let user = await getUser(userData.id.toString());
    if (user == null) {
      user = await createUser({
        id: userData.id.toString(),
        name: userData.name,
        role: "member",
        verified: false,
      });
      created = true;
    }

    const session = await createSession(user.id, `GitHub session`);

    const headers = new Headers();
    setSessionCookie(headers, session);

    if (redirect !== undefined) {
      headers.append("Location", redirect.toString());
      return new Response(null, {
        status: Status.Found,
        headers,
      });
    }

    return Response.json(
      { session },
      { headers, status: created ? Status.Created : Status.OK },
    );
  },
};
