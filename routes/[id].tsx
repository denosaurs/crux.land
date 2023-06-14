import { Handlers, Status } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

import { SessionState } from "~/middlewares/session.ts";

import { getScript, Script } from "~/models/script.ts";
import { Session } from "~/models/session.ts";

import { Footer } from "~/components/Footer.tsx";
import { Header } from "~/components/Header.tsx";
import { Layout } from "~/components/Layout.tsx";

export interface ScriptPageProps {
  session?: Session;
  script: Script;
}

export const handler: Handlers<ScriptPageProps, SessionState> = {
  async GET(req, ctx) {
    const isHtml = req.headers.get("accept")?.includes("html");
    const script = await getScript(ctx.params.id);

    if (isHtml) {
      if (script == null) {
        // return ctx.renderNotFound();
        return ctx.render("hi");
      }
      return ctx.render({ session: ctx.state.session, script });
    }

    if (script == null) {
      return Response.json(
        {
          message: `Could not find script with id ${ctx.params.id}`,
        },
        {
          status: Status.NotFound,
        },
      );
    }

    return new Response(script.content, {
      status: Status.OK,
      headers: new Headers({
        "Content-Type": `${script.contentType!}; charset=utf-8`,
      }),
    });
  },
};

export default function Script({
  data: { script },
}: {
  data: { script: Script };
}) {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <title>
          crux.land | Registry for permanently hosting small scripts
        </title>
        <meta content="Crux.land" property="og:title" />
        <meta
          content="Free registry service meant for hosting small (≤ 20kB) single deno scripts."
          property="og:description"
        />
        <meta content="https://crux.land" property="og:url" />
        <meta content="#3f72a0" data-react-helmet="true" name="theme-color" />
        <link rel="stylesheet" href="styles.css" />
      </Head>
      <Layout>
        <Header authenticated={false} />
        <div class="mt-4 pb-8 flex rounded-lg text-black text-1xl lg:text-1xl bg-primary">
          <code>{script.content}</code>
        </div>
        <Footer />
      </Layout>
    </>
  );
}
