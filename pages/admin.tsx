import { h } from "../deps.ts";
import { Layout } from "../components/layout.tsx";
import { Block } from "../components/block.tsx";
import { ResultButton } from "../components/result_button.tsx";

export function Admin() {
  return (
    <Layout
      title="crux.land"
      script="
        const user = getUser();

        if (user === null || user.admin === false) {
          location.href = '/';
        }

        const requestList = document.getElementById('requestList');
        const usersCache = {};

        fetch('/api/alias/requests', {
          body: JSON.stringify({ user: user.id, secret: user.secret }),
          method: 'POST',
        }).then(async (res) => {
          const requests = await res.json();

          for (const { alias, owner, tags } of requests) {
            const outer = document.createElement('div');
            outer.className = 'w-full mb-2 justify-center py-2 px-4 border border-gray-300 rounded-md bg-gray-100 text-gray-900 font-medium';
            
            const label = document.createElement('label');
            label.className = 'flex flex-row items-center space-x-3 text-gray-900 font-medium';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = JSON.stringify({ alias, owner });
            checkbox.className = 'appearance-none h-6 w-6 rounded-md';
            checkbox.name = 'request';

            const aliasText = document.createElement('span');
            aliasText.style = 'min-width: 50%;';
            aliasText.innerHTML = alias;

            const ownerLink = document.createElement('a');

            if (!usersCache[owner]) {
              usersCache[owner] = await (await fetch(new URL(owner, 'https://api.github.com/user/'))).json();
            }

            ownerLink.href = new URL(owner, 'https://api.github.com/user/');
            ownerLink.innerHTML = usersCache[owner].login;

            label.append(checkbox, aliasText, ownerLink);
            outer.appendChild(label);
            requestList.appendChild(outer);
          }
        });
      "
      style="
        input[type=checkbox] {
          outline-color: rgba(209,213,219,var(--tw-border-opacity));
          outline-width: 1px;
          outline-style: solid;
        }

        input[type=checkbox]:checked {
          background-color: rgba(37,99,235,var(--tw-bg-opacity));
          border-width: 4px;
          border-color: rgba(243,244,246,var(--tw-bg-opacity));
        }
      "
    >
      <Block>
        <div className="flex flex-col">
          <div
            className="mt-4 h-80 w-full flex flex-row py-2 px-4 border border-gray-300 rounded-md bg-gray-50"
          >
            <div
              className="flex flex-col inset-y-0 left-0 mr-2 overflow-y-auto w-full"
              id="requestList"
            >
            </div>
          </div>
          <div
            className="w-full flex flex-row mt-2 space-x-2"
          >
            <input
              className="w-full flex justify-center cursor-pointer py-2 px-4 border border-gray-300 text-md font-medium rounded-md text-green-700 bg-gray-100 hover:text-green-500 hover:bg-gray-50 active:bg-gray-100 active:text-gray-700 transition duration-150 ease-in-out focus:outline-none focus:shadow-outline-blue focus:border-blue-300"
              type="button"
              id="approve"
              value="approve"
              // @ts-ignore TS2322
              onclick="
                const result = document.getElementById('result');
                const requests = [...document.getElementsByName('request')].filter((elem) => elem.checked).map((elem) => JSON.parse(elem.value));

                for (const { owner, alias } of requests) {
                  fetch('/api/alias/approve', {
                    body: JSON.stringify({ user: user.id, secret: user.secret, owner, alias }),
                    method: 'POST',
                  }).then(async (res) => {
                    const resultButton = document.createElement('div');
                    resultButton.className = 'flex flex-row justify-around w-full mb-2 py-2 px-4 space-x-4 border border-gray-300 rounded-md bg-gray-100 font-medium';

                    if (res.ok) {
                      resultButton.className += ' text-green-700';
                      resultButton.innerHTML = `Successfully approved ${alias} by ${usersCache[owner].login}`;
                      [...document.getElementsByName('request')].find((elem) => {
                        const e = JSON.parse(elem.value);
                        return e.alias === alias && e.owner === owner;
                      }).parentElement.parentElement.remove();
                    } else {
                      resultButton.className += ' text-red-700';
                      resultButton.innerHTML = (await res.json()).error;
                    }

                    result.appendChild(resultButton);
                  });
                }
              "
            />
            <input
              className="w-full flex justify-center cursor-pointer py-2 px-4 border border-gray-300 text-md font-medium rounded-md text-red-700 bg-gray-100 hover:text-red-500 hover:bg-gray-50 active:bg-gray-100 active:text-gray-700 transition duration-150 ease-in-out focus:outline-none focus:shadow-outline-blue focus:border-blue-300"
              type="button"
              id="deny"
              value="deny"
              // @ts-ignore TS2322
              onclick="
                const result = document.getElementById('result');
                const requests = [...document.getElementsByName('request')].filter((elem) => elem.checked).map((elem) => JSON.parse(elem.value));

                for (const { owner, alias } of requests) {
                  fetch('/api/alias/deny', {
                    body: JSON.stringify({ user: user.id, secret: user.secret, owner, alias }),
                    method: 'POST',
                  }).then(async (res) => {
                    const resultButton = document.createElement('div');
                    resultButton.className = 'flex flex-row justify-around w-full mb-2 py-2 px-4 space-x-4 border border-gray-300 rounded-md bg-gray-100 font-medium';
                    
                    if (res.ok) {
                      resultButton.className += ' text-green-700';
                      resultButton.innerHTML = `Successfully denied ${alias} by ${usersCache[owner].login}`;
                      [...document.getElementsByName('request')].find((elem) => {
                        const e = JSON.parse(elem.value);
                        return e.alias === alias && e.owner === owner;
                      }).parentElement.parentElement.remove();
                    } else {
                      resultButton.className += ' text-red-700';
                      resultButton.innerHTML = (await res.json()).error;
                    }

                    result.appendChild(resultButton);
                  });
                }
              "
            />
          </div>
          <div
            className="flex flex-col-reverse h-48 mt-2 py-2 px-4 inset-y-0 right-0 border border-gray-300 rounded-md bg-gray-50 overflow-y-auto w-full"
            id="result"
          >
          </div>
        </div>
      </Block>
    </Layout>
  );
}
