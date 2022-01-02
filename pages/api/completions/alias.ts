import { HandlerContext } from "../../../server_deps.ts";
import { PageConfig } from "../../../deps.ts";
import { json } from "../../../util/responses.ts";
import { DYNAMO_ALIAS_TABLE } from "../../../util/backend_constants.ts";
import { DYNAMO_CLIENT } from "../../../util/clients.ts";

export const handler = {
  async GET(_: HandlerContext): Promise<Response> {
    const { Items: items } = await DYNAMO_CLIENT.scan({
      TableName: DYNAMO_ALIAS_TABLE,
    });

    return json(items!.map((item) => item!.alias!.S));
  },
};

export const config: PageConfig = { routeOverride: "/api/completions" };
