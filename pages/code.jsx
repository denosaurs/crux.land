import { h } from "../deps.ts";
import { Layout } from "../components/Layout.jsx";
import { CodeBlock } from "../components/CodeBlock.jsx";
import { Block } from "../components/Block.jsx";

export function Code({ code, language }) {
  return (
    <Layout title="crux.land">
      <Block>
        <CodeBlock code={code} language={language} />
      </Block>
    </Layout>
  );
}
