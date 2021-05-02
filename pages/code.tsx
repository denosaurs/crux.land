import { h } from "../deps.ts";
import { Layout } from "../components/layout.tsx";
import { CodeBlock } from "../components/code_block.tsx";
import { Block } from "../components/block.tsx";

export function Code({ code, language }: { code: string; language: string }) {
  return (
    <Layout>
      <Block>
        <CodeBlock code={code} language={language} />
      </Block>
    </Layout>
  );
}
