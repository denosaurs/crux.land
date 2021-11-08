import { HandlerContext } from "../../../server_deps.ts";
import { couldNotAuthenticate, json } from "../../../util/responses.ts";
import { getRequests } from "../../../util/alias.ts";
import { authenticate } from "../../../util/user.ts";

export const handler = {
  async POST(ctx: HandlerContext): Promise<Response> {
    const { user, secret } = await ctx.req.json();

    if (!await authenticate(user, secret, true)) {
      return couldNotAuthenticate();
    }

    return json(await getRequests());
  },
};
