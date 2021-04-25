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
      const json = new URLSearchParams(new URL(document.URL).search).get('user');

      if (json !== null) {
        localStorage.setItem('user', decodeURIComponent(json));
        location.href = '/alias';
      } else if (localStorage.getItem('user') === null) {
        location.href = '/api/login';
      }

      const { id: user, secret, admin } = JSON.parse(localStorage.getItem('user'));
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
              <form
                className="m-0"
                id="form"
                // @ts-ignore TS2322
                onreset="
                  const alias = document.getElementById('alias');
                  alias.innerText = '';
                "
                onsubmit="
                const form = document.getElementById('form');
                const request = document.getElementById('request');
                const alias = document.getElementById('alias').value;
                const result = document.getElementById('result');

                event.preventDefault();

                result.style.display = 'none';

                request.disabled = true;
                
                fetch('/api/alias/request', {
                  method: 'POST',
                  body: JSON.stringify({
                    alias, user, secret
                  }),
                }).then((res) => {
                  request.disabled = false;

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
                  form.reset();
                });
                "
              >
                <div className="mb-2 mt-4 lg:mt-0">
                  <TextButton
                    // @ts-ignore TS2322
                    name="alias"
                    id="alias"
                    placeholder="alias"
                    required
                  />
                </div>
                <div className="mb-2 mt-2 lg:mt-0">
                  <InputButton
                    // @ts-ignore TS2322
                    type="submit"
                    name="request"
                    id="request"
                    value="Request"
                  />
                </div>
              </form>
              <div className="select-all cursor-text">
                <ResultButton
                  // @ts-ignore TS2322
                  id="result"
                />
              </div>
            </div>
          </div>
          <div
            className="mt-4 h-96 w-full flex py-2 px-4 border border-gray-300 rounded-md bg-gray-50 overflow-y-scroll"
          >
          </div>
        </div>
      </Block>
    </Layout>
  );
}
