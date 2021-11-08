import { HandlerContext } from "../../../server_deps.ts";
import { json } from "../../../util/responses.ts";
import { listAliases } from "../../../util/alias.ts";

export const handler = {
  async POST(ctx: HandlerContext): Promise<Response> {
    const { user } = await ctx.req.json();

    return json(await listAliases(user));
  },
};
