/** @jsx h */
import { h, PageConfig } from "../deps.ts";
import { HandlerContext } from "../server_deps.ts";
import { notFound, redirect } from "../util/responses.ts";
import { EXTENSION_FROM_CONTENT_TYPE, ID_PATH } from "../util/constants.ts";
import { Layout } from "../components/layout.tsx";
import { Block } from "../components/block.tsx";
import { CodeBlock } from "../components/code_block.tsx";
import { decodeUTF8, readToUint8Array } from "../util/util.ts";
import { S3_CLIENT } from "../util/clients.ts";
import { getIdFromAlias } from "../util/alias.ts";

type RenderArgs = {
  code: string;
  language: string;
};

export default function Page({
  renderArgs,
}: {
  renderArgs: RenderArgs;
}) {
  return (
    <Layout>
      <Block>
        <CodeBlock code={renderArgs.code} language={renderArgs.language} />
      </Block>
    </Layout>
  );
}

export const handler = {
  async GET(ctx: HandlerContext): Promise<Response> {
    if (ctx.req.headers.get("accept")?.includes("text/html")) {
      let id: string | undefined = ctx.match.id;
      const { alias, tag } = ctx.match;
      if (alias !== undefined && tag !== undefined) {
        id = await getIdFromAlias(alias, tag);
      }

      if (id === undefined) {
        return notFound();
      }

      const file = await S3_CLIENT.getObject(id);

      if (file === undefined) {
        return notFound();
      }

      const body = await readToUint8Array(file.body);
      const code = decodeUTF8(body);
      const language = EXTENSION_FROM_CONTENT_TYPE[
        file.contentType! as keyof typeof EXTENSION_FROM_CONTENT_TYPE
      ];

      return ctx.render!({
        code,
        language,
      } as RenderArgs);
    } else {
      return redirect(`/api/get${ctx.req.url}`);
    }
  },
};

export const config: PageConfig = { routeOverride: `/${ID_PATH}` }; // TODO: ID_ALIAS
