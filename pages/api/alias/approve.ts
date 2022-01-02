import { HandlerContext, Status } from "../../../server_deps.ts";
import {
  couldNotAuthenticate,
  created,
  error,
} from "../../../util/responses.ts";
import { approveRequest } from "../../../util/alias.ts";
import { authenticate } from "../../../util/user.ts";

export const handler = {
  async POST(ctx: HandlerContext): Promise<Response> {
    const { owner, alias, user, secret } = await ctx.req.json();

    if (!await authenticate(user, secret, true)) {
      return couldNotAuthenticate();
    }

    try {
      await approveRequest(
        owner,
        alias,
      );
    } catch (_) {
      return error("Alias approval failed", Status.BadRequest);
    }

    return created();
  },
};
