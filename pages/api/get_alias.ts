import { HandlerContext } from "../../server_deps.ts";
import { ALIAS_PATH } from "../../util/constants.ts";
import { notFound, redirect } from "../../util/responses.ts";
import { PageConfig } from "../../deps.ts";
import { getIdFromAlias } from "../../util/alias.ts";

export const handler = {
  async GET(ctx: HandlerContext): Promise<Response> {
    const { alias, tag, ext } = ctx.match as {
      alias: string;
      tag: string;
      ext: string | undefined;
    };

    const id = await getIdFromAlias(alias, tag);

    if (id === undefined) {
      return notFound();
    }

    return redirect(`/api/get/${id}${ext}`);
  },
};

export const config: PageConfig = { routeOverride: `/api/get/${ALIAS_PATH}` };
