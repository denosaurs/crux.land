/** @jsx h */
import { h, PageConfig, tw, useData, useState } from "../deps.ts";
import { Layout, useSignedIn } from "../components/layout.tsx";
import { InputButton } from "../components/input_button.tsx";
import { Block } from "../components/block.tsx";
import { TextButton } from "../components/text_button.tsx";
import { ResultButton } from "../components/result_button.tsx";
import { Alias as AliasInterface, Tags } from "../util/shared_interfaces.ts";

export default function Alias() {
  const signedIn = useSignedIn();

  const aliases = useData<AliasInterface[]>("", async () => {
    const res = await fetch("/api/alias/list", {
      method: "POST",
      body: JSON.stringify(signedIn.user ?? {}),
    });
    return res.json();
  });

  const [alias, setAlias] = useState<string>("");
  const [tags, setTags] = useState<Tags>({});

  /*TODO
      if (user === null) {
        location.href = '/';
      }
  */
  return (
    <Layout
      style="
        input[type=radio] {
          outline-color: rgba(209,213,219,var(--tw-border-opacity));
          outline-width: 1px;
          outline-style: solid;
        }

        input[type=radio]:checked {
          background-color: rgba(37,99,235,var(--tw-bg-opacity));
          border-width: 4px;
          border-color: rgba(243,244,246,var(--tw-bg-opacity));
        }
      "
    >
      <Block>
        <div class={tw`flex flex-col`}>
          <div class={tw`inset-y-0 left-0 w-full flex flex-col lg:flex-row`}>
            <div class={tw`inset-y-0 left-0 w-full lg:w-1/2`}>
              To request an alias simply enter an alias and press request. The
              request will then be either granted or denied by our admins and
              will then appear in your list of aliases below. You may then
              create a release for your alias which connects a script previously
              uploaded with your alias and provided tag.
            </div>
            <div
              class={tw
                `flex flex-col inset-y-0 right-0 w-full lg:w-1/2 lg:ml-2`}
            >
              <div class={tw`mb-2 mt-4 lg:mt-0`}>
                <TextButton
                  // @ts-ignore TS2322
                  id="aliasInput"
                  placeholder="alias"
                  required
                />
              </div>
              <div class={tw`mb-2 mt-2 lg:mt-0`}>
                <InputButton
                  // @ts-ignore TS2322
                  type="button"
                  id="request"
                  value="Request"
                  onclick="
                    const request = document.getElementById('request');
                    const alias = document.getElementById('aliasInput').value;
                    const result = document.getElementById('requestResult');
                    const user = getUser();

                    result.style.display = 'none';

                    request.disabled = true;

                    fetch('/api/alias/request', {
                      method: 'POST',
                      body: JSON.stringify({
                        alias, user: user.id, secret: user.secret
                      }),
                    }).then((res) => {
                      if (res.ok) {
                        result.style.color = 'rgba(52, 211, 153, var(--tw-text-opacity))';
                        result.innerText = 'Successfully requested!';
                      } else {
                        res.json().then(({ error }) => {
                          result.style.color = 'rgba(220, 38, 38, var(--tw-text-opacity))';
                          result.innerText = error;
                        });
                      }
                      result.style.display = 'flex';

                      alias.innerText = '';
                      request.disabled = false;
                    });
                    "
                />
              </div>
              <div class={tw`select-all cursor-text`}>
                <ResultButton // @ts-ignore TS2322
                 id="requestResult" />
              </div>
            </div>
          </div>
          <div
            class={tw`mt-4 h-96 w-full flex flex-row py-2 px-4 border border-gray-300 rounded-md bg-gray-50`}>
            <div class={tw`flex flex-col inset-y-0 left-0 mr-2 overflow-y-auto w-1/2`}>
              {aliases.map(({alias, tags}, i) => (
                <div class={tw`w-full mb-2 justify-center py-2 px-4 border border-gray-300 rounded-md bg-gray-100`}>
                  <label class={tw`flex items-center space-x-3 text-gray-900 font-medium`}>
                    <input type="radio" name="alias" value={alias} class={tw`appearance-none h-6 w-6 rounded-full cursor-pointer`} onClick={() => {
                      setAlias(alias);
                      setTags(tags);
                    }} checked={i === 0} />
                    <span>{alias}</span>
                  </label>
                </div>
              ))}
            </div>
            <div class={tw`flex flex-col py-2 px-4 inset-y-0 right-0 border border-gray-300 rounded-md bg-gray-100 overflow-y-auto w-1/2`}>
              {Object.entries(tags).map(([tag, script]: [string, string]) => (
                <div class={tw`flex flex-row justify-around w-full mb-2 py-2 px-4 space-x-4 border border-gray-300 rounded-md bg-gray-100 text-gray-900 font-medium`}>
                  <a href={new URL(`${alias}@${tag}`, location.origin).href}>{tag}</a>
                  <a href={new URL(script, location.origin).href}>{script}</a>
                </div>
              ))}
            </div>
          </div>
          <div class={tw`flex flex-row mt-2`}>
            <div class={tw`w-1/3`}>
              <TextButton
                // @ts-ignore TS2322
                id="tag"
                placeholder="tag"
                required
              />
            </div>
            <div class={tw`ml-2 mr-2 w-1/3`}>
              <TextButton
                // @ts-ignore TS2322
                id="script"
                placeholder="script"
                required
              />
            </div>
            <div class={tw`w-1/3`}>
              <InputButton
                // @ts-ignore TS2322
                type="button"
                id="release"
                value="release"
                onclick="
                  const release = document.getElementById('release');
                  const tag = document.getElementById('tag').value;
                  const script = document.getElementById('script').value;
                  const result = document.getElementById('releaseResult');
                  const alias = [...document.getElementsByName('alias')].find((elem) => elem.checked).value;
                  const user = getUser();

                  if (tag === '' || script === '') {
                    result.style.color = 'rgba(220, 38, 38, var(--tw-text-opacity))';
                    result.innerText = 'Must have both script and tag';
                    result.style.display = 'flex';

                    return;
                  }

                  release.disabled = true;

                  fetch('/api/alias/release', {
                    method: 'POST',
                    body: JSON.stringify({
                      alias,
                      user: user.id,
                      secret: user.secret,
                      tag,
                      script
                    }),
                  }).then((res) => {
                    if (res.ok) {
                      result.style.color = 'rgba(52, 211, 153, var(--tw-text-opacity))';
                      result.innerText = 'Successfully released!';
                    } else {
                      res.json().then(({ error }) => {
                        result.style.color = 'rgba(220, 38, 38, var(--tw-text-opacity))';
                        result.innerText = error;
                      });
                    }
                    result.style.display = 'flex';

                    release.disabled = false;

                    listAliases();
                  });
                "
              >
              </InputButton>
            </div>
          </div>
        </div>
        <div class={tw`select-all cursor-text mt-2 w-full`}>
          <ResultButton // @ts-ignore TS2322
           id="releaseResult" />
        </div>
      </Block>

      <div
        style="display: none"
        class={tw
          `w-full mb-2 justify-center py-2 px-4 border border-gray-300 rounded-md bg-gray-100 flex items-center space-x-3 text-gray-900 font-medium appearance-none h-6 w-6 rounded-full flex-row justify-around space-x-4 cursor-pointer`}
      >
        UGLY HACK!
      </div>
    </Layout>
  );
}

export const config: PageConfig = { runtimeJS: true };
