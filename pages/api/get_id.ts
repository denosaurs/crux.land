import { HandlerContext, Status } from "../../server_deps.ts";
import { EXTENSION_FROM_CONTENT_TYPE, ID_PATH } from "../../util/constants.ts";
import { notFound, redirect } from "../../util/responses.ts";
import { PageConfig } from "../../deps.ts";
import { S3_CLIENT } from "../../util/clients.ts";

export const handler = {
  async GET(ctx: HandlerContext): Promise<Response> {
    const { id, ext } = ctx.match as { id: string; ext: string | undefined };

    if (ext === "" || ext === undefined) {
      const file = await S3_CLIENT.headObject(id);

      if (file === undefined) {
        return notFound();
      }

      return redirect(`/api/get/${id}.${
        EXTENSION_FROM_CONTENT_TYPE[
          file.contentType! as keyof typeof EXTENSION_FROM_CONTENT_TYPE
        ]
      }`);
    }

    const file = await S3_CLIENT.getObject(id);

    if (file === undefined) {
      return notFound();
    }

    return new Response(file.body, {
      status: Status.OK,
      headers: new Headers({
        "Content-Type": `${file.contentType!}; charset=utf-8`,
      }),
    });
  },
};

export const config: PageConfig = { routeOverride: `/api/get/${ID_PATH}` };
