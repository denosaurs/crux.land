import { h } from "../deps.ts";
import { Layout } from "../components/layout.tsx";
import { InputButton } from "../components/input_button.tsx";
import { Block } from "../components/block.tsx";
import { TextButton } from "../components/text_button.tsx";
import { ResultButton } from "../components/result_button.tsx";

export function Alias() {
  return (
    <Layout
      script="
        const user = getUser();

        if (user === null) {
          location.href = '/';
        }

        async function listAliases() {
          const aliasList = document.getElementById('aliasList');
          const tagList = document.getElementById('tagList');

          const res = await fetch('/api/alias/list', {
            body: JSON.stringify({ user: user.id }),
            method: 'POST',
          });

          aliasList.innerHTML = '';

          const aliases = await res.json();
          let first = true;

          for (const { alias, owner, tags } of aliases) {
            const outer = document.createElement('div');
            outer.className = 'w-full mb-2 justify-center py-2 px-4 border border-gray-300 rounded-md bg-gray-100';

            const label = document.createElement('label');
            label.className = 'flex items-center space-x-3 text-gray-900 font-medium';

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.value = alias;
            radio.className = 'appearance-none h-6 w-6 rounded-full cursor-pointer';
            radio.name = 'alias';
            radio.onclick = () => {
              tagList.innerHTML = '';
              
              for (const tag in tags) {
                const script = tags[tag];
                const tagButton = document.createElement('div');
                tagButton.className = 'flex flex-row justify-around w-full mb-2 py-2 px-4 space-x-4 border border-gray-300 rounded-md bg-gray-100 text-gray-900 font-medium';
                
                const tagLink = document.createElement('a');
                tagLink.href = new URL(`${alias}@${tag}`, new URL(document.URL).origin);
                tagLink.innerHTML = tag;

                const scriptLink = document.createElement('a');
                scriptLink.href = new URL(script, new URL(document.URL).origin);
                scriptLink.innerHTML = script;
                
                tagButton.append(tagLink, scriptLink);
                tagList.appendChild(tagButton);
              }
            };

            if (first) {
              radio.click();
              first = false;
            }

            const text = document.createElement('span');
            text.innerHTML = alias;

            label.append(radio, text);
            outer.appendChild(label);
            aliasList.appendChild(outer);
          }
        }

        listAliases();
      "
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
        <div class="flex flex-col">
          <div class="inset-y-0 left-0 w-full flex flex-col lg:flex-row">
            <div class="inset-y-0 left-0 w-full lg:w-1/2">
              To request an alias simply enter an alias and press request. The
              request will then be either granted or denied by our admins and
              will then appear in your list of aliases below. You may then
              create a release for your alias which connects a script previously
              uploaded with your alias and provided tag.
            </div>
            <div class="flex flex-col inset-y-0 right-0 w-full lg:w-1/2 lg:ml-2">
              <div class="mb-2 mt-4 lg:mt-0">
                <TextButton
                  // @ts-ignore TS2322
                  id="aliasInput"
                  placeholder="alias"
                  required
                />
              </div>
              <div class="mb-2 mt-2 lg:mt-0">
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
              <div class="select-all cursor-text">
                <ResultButton // @ts-ignore TS2322
                 id="requestResult" />
              </div>
            </div>
          </div>
          <div class="mt-4 h-96 w-full flex flex-row py-2 px-4 border border-gray-300 rounded-md bg-gray-50">
            <div
              class="flex flex-col inset-y-0 left-0 mr-2 overflow-y-auto w-1/2"
              id="aliasList"
            >
            </div>
            <div
              class="flex flex-col py-2 px-4 inset-y-0 right-0 border border-gray-300 rounded-md bg-gray-100 overflow-y-auto w-1/2"
              id="tagList"
            >
            </div>
          </div>
          <div class="flex flex-row mt-2">
            <div class="w-1/3">
              <TextButton
                // @ts-ignore TS2322
                id="tag"
                placeholder="tag"
                required
              />
            </div>
            <div class="ml-2 mr-2 w-1/3">
              <TextButton
                // @ts-ignore TS2322
                id="script"
                placeholder="script"
                required
              />
            </div>
            <div class="w-1/3">
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
        <div class="select-all cursor-text mt-2 w-full">
          <ResultButton // @ts-ignore TS2322
           id="releaseResult" />
        </div>
      </Block>

      <div
        style="display: none"
        class="w-full mb-2 justify-center py-2 px-4 border border-gray-300 rounded-md bg-gray-100 flex items-center space-x-3 text-gray-900 font-medium appearance-none h-6 w-6 rounded-full flex-row justify-around space-x-4 cursor-pointer"
      >
        UGLY HACK!
      </div>
    </Layout>
  );
}
