/** @jsx h */
import { h, PageConfig, StateUpdater, tw, useData, useState } from "../deps.ts";
import { Layout, User, useSignedIn } from "../components/layout.tsx";
import { Block } from "../components/block.tsx";
import { Alias, Requests } from "../util/shared_interfaces.ts";
import { ResultButton } from "../components/result_button.tsx";
import { InputButton } from "../components/input_button.tsx";

interface AliasWithOwnerData extends Alias {
  ownerData: {
    login: string;
  };
}

interface Checked {
  alias: string;
  owner: number;
}

function RequestCard(
  { alias, owner, ownerData }: AliasWithOwnerData,
  checked: Checked[],
  setChecked: StateUpdater<Checked[]>,
) {
  const isChecked = checked.some((checked) =>
    checked.alias === alias && checked.owner === owner
  );
  return (
    <ResultButton>
      <label
        className={tw
          `flex flex-row items-center space-x-3 text-gray-900 font-medium`}
      >
        <input
          type="checkbox"
          value={JSON.stringify({
            alias,
            owner,
          })}
          checked={isChecked}
          onClick={() =>
            setChecked((prev) => {
              if (isChecked) {
                return prev.filter((checked) =>
                  !(checked.alias === alias && checked.owner === owner)
                );
              } else {
                return [...prev, { alias, owner }];
              }
            })}
          className={tw`appearance-none h-6 w-6 rounded-md cursor-pointer`}
          name="request"
        />
        {/* TODO: min-width: 50% */}
        <span>{alias}</span>
        <a
          href={new URL(owner.toString(), "https://api.github.com/user/").href}
        >
          {ownerData.login}
        </a>
      </label>
    </ResultButton>
  );
}

interface ApproveStatus {
  ok: boolean;
  error?: string;
}

async function handleRequests(
  user: User,
  { owner, alias }: Checked,
  deny: boolean,
): Promise<ApproveStatus> {
  const res = await fetch(deny ? "/api/alias/deny" : "/api/alias/approve", {
    body: JSON.stringify({ user: user.id, secret: user.secret, owner, alias }),
    method: "POST",
  });
  return {
    ok: res.ok,
    error: !res.ok ? (await res.json()).error : undefined,
  };
}

export default function Admin() {
  const signedIn = useSignedIn();
  const usersCache: Record<number, {
    login: string;
  }> = {};
  let requests = useData<AliasWithOwnerData[]>("", async () => {
    const res = await fetch("/api/alias/requests", {
      method: "POST",
      body: JSON.stringify(signedIn.user),
    });
    const reqs: Requests & { ownerData?: unknown }[] = await res.json();
    for (const req of reqs) {
      if (!usersCache[req.owner]) {
        const ownerReq = await fetch(
          new URL(req.owner.toString(), "https://api.github.com/user/"),
        );
        usersCache[req.owner] = await ownerReq.json();
      }
      req.ownerData = usersCache[req.owner];
    }
    return reqs as AliasWithOwnerData[];
  });
  let deny = false;

  /*
TODO:
  if (user === null || user.admin === false) {
    location.href = '/';
  }
 */

  const [checked, setChecked] = useState<Checked[]>([]);
  const [results, setResults] = useState<Checked[] & ApproveStatus[]>([]);

  return (
    <Layout style="
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
      ">
      <Block>
        <form
          class={tw`flex flex-col`}
          onSubmit={async (e) => {
            e.preventDefault();
            for (const data of checked) {
              handleRequests(signedIn.user!, data, deny).then((res) => {
                setResults((prev) => {
                  return [...prev, {
                    ...data,
                    ...res,
                  }];
                });
                requests = requests.filter((checked) =>
                  !(checked.alias === data.alias &&
                    checked.owner === data.owner)
                );
              });
            }
          }}
        >
          <div
            class={tw
              `mt-4 h-80 w-full flex flex-row py-2 px-4 border border-gray-300 rounded-md bg-gray-50`}
          >
            <div
              class={tw
                `flex flex-col inset-y-0 left-0 mr-2 overflow-y-auto w-full`}
            >
              {requests.map((req) => RequestCard(req, checked, setChecked))}
            </div>
          </div>
          <div class={tw`w-full flex flex-row mt-2 space-x-2`}>
            <InputButton type="submit">
              <span class={tw`text-green-700 hover:text-green-500`}>
                approve
              </span>
            </InputButton>
            <InputButton type="submit" onClick={() => deny = true}>
              <span class={tw`text-red-700 hover:text-red-500`}>deny</span>
            </InputButton>
          </div>
          <div
            class={tw
              `flex flex-col-reverse h-48 mt-2 py-2 px-4 inset-y-0 right-0 border border-gray-300 rounded-md bg-gray-50 overflow-y-auto w-full`}
          >
            {results.map((res: Checked & ApproveStatus) => (
              <div
                class={tw
                  `flex flex-row justify-around w-full mb-2 py-2 px-4 space-x-4 border border-gray-300 rounded-md bg-gray-100 font-medium`}
              >
                {res.ok
                  ? (
                    <span className={tw`text-green-700`}>
                      Successfully {deny ? "denied" : "approved"} {res.alias} by
                      {" "}
                      {usersCache[res.owner].login}
                    </span>
                  )
                  : <span className={tw`text-red-700`}>{res.error!}</span>}
              </div>
            ))}
          </div>
        </form>
      </Block>

      <div
        style="display: none"
        class={tw
          `w-full mb-2 justify-center py-2 px-4 border border-gray-300 rounded-md bg-gray-100 text-gray-900 font-medium flex flex-row items-center space-x-3 appearance-none h-6 w-6 justify-around space-x-4 text-green-700 text-red-700 cursor-pointer`}
      >
        UGLY HACK!
      </div>
    </Layout>
  );
}

export const config: PageConfig = { runtimeJS: true };
