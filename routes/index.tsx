import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

import { SessionState } from "~/middlewares/session.ts";

import { Footer } from "~/components/Footer.tsx";
import { Header } from "~/components/Header.tsx";
import { Layout } from "~/components/Layout.tsx";
import { Content } from "~/components/Content.tsx";

export interface IndexPageProps {
  authenticated: boolean;
}

export const handler: Handlers<IndexPageProps, SessionState> = {
  GET(_req, ctx) {
    return ctx.render({ authenticated: ctx.state.session?.valid ?? false });
  },
};

export default function IndexPage(
  { data: { authenticated } }: PageProps<IndexPageProps>,
) {
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
        <Header authenticated={authenticated} />
        <Content />
        <Footer />
      </Layout>
    </>
  );
}
