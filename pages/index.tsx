/** @jsx h */
import { encodeBase64, h, PageConfig, tw, useState } from "../deps.ts";
import { Block } from "../components/block.tsx";
import { EXTENSIONS } from "../util/constants.ts";
import { CodeInline } from "../components/code_inline.tsx";
import { LabelButton } from "../components/label_button.tsx";
import { InputButton } from "../components/input_button.tsx";
import { ResultButton } from "../components/result_button.tsx";
import { Layout } from "../components/layout.tsx";

interface Result {
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
        return window.location.href + result!.content!;
      case 2:
        return <span className={tw`text-red-600`}>{result!.content!}</span>;
    }
  }

  return (
    <Layout description>
      <Block>
        <div class={tw`flex flex(col lg:row)`}>
          <div class={tw`inset-y-0 left-0 w(full lg:3/5)`}>
            crux.land is a free registry service meant for hosting small (≤
            20kB) single deno scripts. All uploaded scripts are immutable and
            will not be changed nor deleted unless there is a legal reason or if
            it is found to be malicious.

            <br />
            <br />

            To use crux.land simply upload a file with one of the supported file
            extensions ({EXTENSIONS.map((ext, idx) => (
              <span>
                <CodeInline>{ext}</CodeInline>
                {EXTENSIONS.length - 1 === idx ? "" : ", "}
              </span>
            ))}) and if successful you will receive a permanent link to said
            file. This link may be used in deno or browsers import and
            automatically serve the correct{" "}
            <CodeInline>Content-Type</CodeInline>{" "}
            header. An optional extension may be added to the end of the url but
            is not necessary as it is automatically redirected to.

            <br />
            <br />

            A custom name may also be requested to be associated with your
            uploaded scripts. These aliases are versioned and can be updated
            with new tags unlike the raw links for a script which are permanent
            and therefor not versioned. To request an alias a GitHub account
            login is required to prevent abuse.
          </div>
          <form
            class={tw`flex flex-col inset-y-0 right-0 w(full lg:2/5)`}
            onSubmit={async (e) => {
              e.preventDefault();

              if (file === null) {
                return;
              }

              const data = await file.arrayBuffer();
              setResult({ status: 0 });
              const res = await fetch("/api/add", {
                method: "POST",
                body: JSON.stringify({
                  name: file.name,
                  content: encodeBase64(data),
                }),
              });

              if (res.ok) {
                res.json().then(({ id }) =>
                  setResult({
                    status: 1,
                    content: id,
                  })
                );
              } else {
                res.json().then(({ error }) =>
                  setResult({
                    status: 2,
                    content: error,
                  })
                );
              }
            }}
          >
            <input
              type="file"
              id="file"
              accept={EXTENSIONS.map((ext) => "." + ext).join(",")}
              onChange={(e) => setFile(e.target!.files[0])}
              required
              hidden
            />
            <div class={tw`mb-2 mt(4 lg:0)`}>
              <LabelButton // @ts-ignore TS2322
               htmlFor="file">
                {file?.name ?? "Choose a script"}
              </LabelButton>
            </div>
            <div class={tw`mb-2 mt(2 lg:0)`}>
              <InputButton
                // @ts-ignore TS2322
                type="submit"
                name="submit"
                id="submit"
                value="Upload"
              />
            </div>
            <div class={tw`select-all cursor-text`}>
              {result && (
                <ResultButton // @ts-ignore TS2322
                 id="result">
                  {processResult()}
                </ResultButton>
              )}
            </div>
          </form>
        </div>
      </Block>
    </Layout>
  );
}

export const config: PageConfig = { runtimeJS: true };
