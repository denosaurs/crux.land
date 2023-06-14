import { Head } from "$fresh/runtime.ts";

import { Footer } from "~/components/Footer.tsx";
import { Header } from "~/components/Header.tsx";
import { Layout } from "../components/Layout.tsx";
import { Content } from "../components/Content.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <title>crux.land</title>
        <link rel="stylesheet" href="styles.css" />
      </Head>

      <Layout>
        <Header />
        <Content />
        <Footer />
      </Layout>
    </>
  );
}
