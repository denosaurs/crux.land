import { CodeBlock } from "~/components/CodeBlock.tsx";
import { Layout } from "~/components/Layout.tsx";
import { EXTENSION_FROM_CONTENT_TYPE, ID_PATH } from "~/utils/constants.ts";
import { decodeUTF8, readToUint8Array } from "~/utils/util.ts";

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
      <CodeBlock code={renderArgs.code} language={renderArgs.language} />
    </Layout>
  );
}

export const handler = {
  // deno-lint-ignore no-explicit-any
  async GET(ctx: any): Promise<Response> {
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

export const config = { routeOverride: `/${ID_PATH}` }; // TODO: ID_ALIAS
