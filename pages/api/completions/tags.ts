import { HandlerContext } from "../../../server_deps.ts";
import { PageConfig } from "../../../deps.ts";
import { aliasNotFound, json } from "../../../util/responses.ts";
import { getAlias } from "../../../util/alias.ts";

export const handler = {
  async GET(ctx: HandlerContext): Promise<Response> {
    const alias = await getAlias(ctx.match.alias!);

    if (alias === undefined) {
      return aliasNotFound();
    }

    return json(Object.keys(alias.tags));
  },
};

export const config: PageConfig = { routeOverride: "/api/completions" };
