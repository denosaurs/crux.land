import { h } from "../deps.ts";
import { Layout } from "../components/layout.tsx";
import { InputButton } from "../components/input_button.tsx";
import { Block } from "../components/block.tsx";
import { TextButton } from "../components/text_button.tsx";
import { ResultButton } from "../components/result_button.tsx";

export function Alias() {
  return (
    <Layout
      title="crux.land"
      script="
      const user = getUser();

      if (getUser() === null) {
        location.href = '/';
      }

      const aliasList = document.getElementById('aliasList');
  
      fetch('/api/alias/list', {
        body: JSON.stringify({ user: user.id }),
        method: 'POST',
      }).then(async function (res) {
        const aliases = await res.json();

        for (const { alias, owner, tags } of aliases) {
          const outer = document.createElement('div');
          outer.className = 'w-full mb-2 justify-center py-2 px-4 border border-gray-300 text-md font-medium rounded-md bg-gray-100';
          aliasList.appendChild(outer);

          const text = document.createElement('div');
          text.className = '';
          text.innerHTML = alias;
          outer.appendChild(text);
        }
      });
    "
    >
      <Block>
        <div className="flex flex-col">
          <div className="inset-y-0 left-0 w-full flex flex-col lg:flex-row">
            <div className="inset-y-0 left-0 w-full lg:w-1/2">
              To request an alias simply enter an alias and press request. The
              request will then be either granted or denied by our admins and
              will then appear in your list of aliases below. You may then
              create a release for your alias which connects a script previously
              uploaded with your alias and provided tag.
            </div>
            <div
              className="flex flex-col inset-y-0 right-0 w-full lg:w-1/2 lg:ml-2"
            >
              <div className="mb-2 mt-4 lg:mt-0">
                <TextButton
                  // @ts-ignore TS2322
                  id="aliasInput"
                  placeholder="alias"
                  required
                />
              </div>
              <div className="mb-2 mt-2 lg:mt-0">
                <InputButton
                  // @ts-ignore TS2322
                  type="button"
                  id="request"
                  value="Request"
                  onclick="
                    const request = document.getElementById('request');
                    const alias = document.getElementById('aliasInput').value;
                    const result = document.getElementById('result');
                    const user = getUser();

                    if (user === null) {
                      result.style.color = 'rgba(220, 38, 38, var(--tw-text-opacity))';
                      result.innerText = 'You are not logged in...';
                      result.style.display = 'flex';
                    
                      return;
                    }

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
              <div className="select-all cursor-text">
                <ResultButton
                  // @ts-ignore TS2322
                  id="result"
                />
              </div>
            </div>
          </div>
          <div
            className="mt-4 h-96 w-full flex flex-col py-2 px-4 border border-gray-300 rounded-md bg-gray-50 overflow-y-scroll"
            id="aliasList"
          >
          </div>
        </div>
      </Block>
    </Layout>
  );
}
