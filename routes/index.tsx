import { useState } from "preact/hooks";
import { CodeInline } from "~/components/CodeInline.tsx";
import { InputBox } from "~/components/InputBox.tsx";
import { LabelBox } from "~/components/LabelBox.tsx";
import { Layout } from "~/components/Layout.tsx";
import { ResultBox } from "~/components/ResultBox.tsx";
import { EXTENSIONS } from "~/utils/constants.ts";
import { encode as encodeBase64 } from "$std/encoding/base64.ts";
import { Head } from "$fresh/runtime.ts";

export interface Result {
  status: 0 | 1 | 2; // pending, ok, error
  content?: string;
}

export default function Home() {
  const [file, setFile] = useState<null | File>(null);
  const [result, setResult] = useState<null | Result>(null);

  function processResult() {
    switch (result!.status) {
      case 0:
        return "Uploading...";
      case 1:
        return location.href + result!.content!;
      case 2:
        return <span class="text-red-600">{result!.content!}</span>;
    }
  }

  return (
    <>
    <Head>
      <meta charSet="UTF-8" />
      <title>crux.land</title>
      <link rel="stylesheet" href="styles.css" />
    </Head>
    <Layout description>
      <div class="pt-5 flex flex(col lg:row)">
        <div class="inset-y-0 left-0 w(full lg:3/5)">
          crux.land is a free registry service meant for hosting small (≤ 20kB)
          single deno scripts. All uploaded scripts are immutable and will not
          be changed nor deleted unless there is a legal reason or if it is
          found to be malicious.

          <br />
          <br />

          To use crux.land simply upload a file with one of the supported file
          extensions ({EXTENSIONS.map((ext, idx) => (
            <span>
              <CodeInline>{ext}</CodeInline>
              {EXTENSIONS.length - 1 === idx ? "" : ", "}
            </span>
          ))}) and if successful you will receive a permanent link to said file.
          This link may be used in deno or browsers import and automatically
          serve the correct <CodeInline>Content-Type</CodeInline>{" "}
          header. An optional extension may be added to the end of the url but
          is not necessary as it is automatically redirected to.

          <br />
          <br />

          A custom name may also be requested to be associated with your
          uploaded scripts. These aliases are versioned and can be updated with
          new tags unlike the raw links for a script which are permanent and
          therefor not versioned. To request an alias a GitHub account login is
          required to prevent abuse.
        </div>
        <form
          class="flex flex-col inset-y-0 right-0 w(full lg:2/5)"
          onSubmit={async (e) => {
            e.preventDefault();

            if (file === null) {
              return;
            }

            setResult({ status: 0 });
            const res = await fetch("/api/add", {
              method: "POST",
              body: JSON.stringify({
                name: file.name,
                content: encodeBase64(await file.arrayBuffer()),
              }),
            });

            const data = await res.json();

            if (res.ok) {
              setResult({
                status: 1,
                content: data.id,
              });
            } else {
              setResult({
                status: 2,
                content: data.error,
              });
            }
          }}
        >
          <div class="mb-2 mt(4 lg:0)">
            <LabelBox>
              <input
                type="file"
                accept={EXTENSIONS.map((ext) => "." + ext).join(",")}
                // deno-lint-ignore no-explicit-any
                onChange={(e) => setFile((e.target as any)!.files[0])}
                required
                hidden
              />
              {file?.name ?? "Choose a script"}
            </LabelBox>
          </div>
          <div class="mb-2 mt(2 lg:0)">
            <InputBox type="submit" value="Upload" />
          </div>
          {result && (
            <div class="select-all cursor-text">
              <ResultBox>{processResult()}</ResultBox>
            </div>
          )}
        </form>
      </div>
    </Layout>
    </>
  );
}

export const config = { runtimeJS: true };
