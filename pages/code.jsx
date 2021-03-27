import { h } from "../deps.ts";
import { Layout } from "../components/layout.jsx";
import { CodeBlock } from "../components/code_block.jsx";
import { Block } from "../components/block.jsx";

export function Code({ code, language }) {
  return (
    <Layout title="crux.land">
      <Block>
        <CodeBlock code={code} language={language} />
      </Block>
    </Layout>
  );
}
