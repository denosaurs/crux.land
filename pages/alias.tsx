/** @jsx h */
import { h, PageConfig, tw, useState } from "../deps.ts";
import { Layout, useSignedIn } from "../components/layout.tsx";
import { InputBox } from "../components/input_box.tsx";
import { Block } from "../components/block.tsx";
import { InputTextBox } from "../components/input_text_box.tsx";
import { ResultBox } from "../components/result_box.tsx";
import { Alias as AliasInterface, Tags } from "../util/shared_interfaces.ts";
import { Result } from "./index.tsx";
import { useFetch } from "../util/use_fetch.ts";

function CreateAlias() {
  const signedIn = useSignedIn();

  const [alias, setAlias] = useState("");
  const [result, setResult] = useState<null | Result>(null);

  function processResult() {
    switch (result!.status) {
      case 0:
        return "Requesting...";
      case 1:
        return "Successfully requested!";
      case 2:
        return <span className={tw`text-red-600`}>{result!.content!}</span>;
    }
  }

  return (
    <div className={tw`flex flex-col lg:flex-row`}>
      <div className={tw`lg:(flex items-center w-1/2)`}>
        To request an alias simply enter an alias and press request. The
        request will then be either granted or denied by our admins and
        will then appear in your list of aliases below. You may then
        create a release for your alias which connects a script previously
        uploaded with your alias and provided tag.
      </div>
      <form
        onSubmit={async () => {
          setResult({ status: 0 });
          const res = await fetch("/api/alias/request", {
            method: "POST",
            body: JSON.stringify({
              alias,
              ...signedIn.user,
            }),
          });

          if (res.ok) {
            setResult({
              status: 1,
            });
          } else {
            const data = await res.json();
            setResult({
              status: 2,
              content: data.error,
            });
          }
        }}
        className={tw`grid gap-2 mt-4 w-full lg:(w-1/2 ml-2 mt-0 auto-rows-fr)`}
      >
        <InputTextBox
          placeholder="alias"
          value={alias}
          onInput={(e) => setAlias(e.target.value)}
          required
        />
        <InputBox
          type="submit"
          disabled={result?.status === 0}
          value="Request"
        />
        {result
          ? (
            <div className={tw`select-all cursor-text`}>
              <ResultBox>{processResult()}</ResultBox>
            </div>
          )
          : <div />}
      </form>
    </div>
  );
}

function ReleaseAlias({
  alias,
}: {
  alias: string;
}) {
  const signedIn = useSignedIn();

  const [tag, setTag] = useState("");
  const [script, setScript] = useState("");
  const [result, setResult] = useState<null | Result>(null);

  function processResult() {
    switch (result!.status) {
      case 0:
        return "Releasing...";
      case 1:
        return "Successfully released!";
      case 2:
        return <span className={tw`text-red-600`}>{result!.content!}</span>;
    }
  }

  return (
    <form
      className={tw`grid gap-2 grid-cols-3 mt-2`}
      onSubmit={async () => {
        const res = await fetch("/api/alias/release", {
          method: "POST",
          body: JSON.stringify({
            alias,
            tag,
            script,
            ...signedIn.user,
          }),
        });

        if (res.ok) {
          setResult({
            status: 1,
          });
        } else {
          const data = await res.json();
          setResult({
            status: 2,
            content: data.error,
          });
        }
      }}
    >
      <InputTextBox
        placeholder="tag"
        value={tag}
        onInput={(e) => setTag(e.target.value)}
        required
      />
      <InputTextBox
        placeholder="script"
        value={script}
        onInput={(e) => setScript(e.target.value)}
        required
      />
      <InputBox
        type="submit"
        value="release"
        disabled={result?.status === 0}
      />
      {result && (
        <div className={tw`select-all cursor-text col-span-full`}>
          <ResultBox>{processResult()}</ResultBox>
        </div>
      )}
    </form>
  );
}

export default function Alias() {
  const signedIn = useSignedIn();

  const aliases = useFetch<AliasInterface[]>([], async () => {
    const res = await fetch("/api/alias/list", {
      method: "POST",
      body: JSON.stringify(signedIn.user),
    });
    return res.json();
  });

  const [selectedAlias, setSelectedAlias] = useState<string>("");
  const [tags, setTags] = useState<Tags>({});

  /*TODO
      if (user === null) {
        location.href = '/';
      }
  */
  return (
    <Layout>
      <Block>
        <CreateAlias />
        <div
          className={tw
            `mt-4 h-96 w-full flex flex-row py-2 px-4 border border-gray-300 rounded-md bg-gray-50`}
        >
          <div
            className={tw
              `flex flex-col inset-y-0 left-0 mr-2 overflow-y-auto w-1/2`}
          >
            {aliases.map(({
              alias,
              tags
            }, i) => (
              <div
                className={tw
                  `w-full mb-2 justify-center py-2 px-4 border border-gray-300 rounded-md bg-gray-100`}
              >
                <label
                  className={tw
                    `flex items-center space-x-3 text-gray-900 font-medium`}
                >
                  <input
                    type="radio"
                    name="alias"
                    value={alias}
                    className={tw
                      `appearance-none h-6 w-6 rounded-full cursor-pointer outline-gray-300 outline outline-1 checked:(bg-blue-600 border-4 border-gray-100)`}
                    onClick={() => {
                      setSelectedAlias(alias);
                      setTags(tags);
                    }}
                    checked={i === 0}
                  />
                  <span>{alias}</span>
                </label>
              </div>
            ))}
          </div>
          <div
            className={tw
              `flex flex-col py-2 px-4 inset-y-0 right-0 border border-gray-300 rounded-md bg-gray-100 overflow-y-auto w-1/2`}
          >
            {Object.entries(tags).map(([tag, script]: [string, string]) => (
              <div
                className={tw
                  `flex flex-row justify-around w-full mb-2 py-2 px-4 space-x-4 border border-gray-300 rounded-md bg-gray-100 text-gray-900 font-medium`}
              >
                <a
                  href={new URL(`${selectedAlias}@${tag}`, location.origin)
                    .href}
                >
                  {tag}
                </a>
                <a href={new URL(script, location.origin).href}>{script}</a>
              </div>
            ))}
          </div>
        </div>
        <ReleaseAlias alias={selectedAlias} />
      </Block>
    </Layout>
  );
}

export const config: PageConfig = { runtimeJS: true };
