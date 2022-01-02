/** @jsx h */
import { h, PageConfig, StateUpdater, tw, useState } from "../deps.ts";
import {
  BORDER_CLASSES,
  Layout,
  User,
  useSignedIn,
} from "../components/layout.tsx";
import { Alias, Requests } from "../util/shared_interfaces.ts";
import { ResultBox } from "../components/result_box.tsx";
import { InputBox } from "../components/input_box.tsx";
import { useFetch } from "../util/use_fetch.ts";

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
    <ResultBox>
      <label
        class={tw
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
          class={tw
            `appearance-none h-6 w-6 rounded-md cursor-pointer outline-gray-300 outline outline-1 checked:(bg-blue-600 border-4 border-gray-100)`}
          name="request"
        />
        <span>{alias}</span>
        <a
          href={new URL(owner.toString(), "https://api.github.com/user/").href}
        >
          {ownerData.login}
        </a>
      </label>
    </ResultBox>
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
  let requests = useFetch<AliasWithOwnerData[]>([], async () => {
    console.log(signedIn);
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
    <Layout>
      <form
        class={tw`flex flex-col`}
        onSubmit={(e) => {
          e.preventDefault();
          for (const data of checked) {
            handleRequests(signedIn.user!, data, deny).then((res) => {
              setResults((prev) => {
                return [
                  ...prev,
                  {
                    ...data,
                    ...res,
                  },
                ];
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
            `mt-4 h-80 grid gap-2 auto-rows-min overflow-y-auto py-2 px-4 ${BORDER_CLASSES} bg-gray-50`}
        >
          {requests.map((req) => RequestCard(req, checked, setChecked))}
        </div>
        <div class={tw`grid gap-2 grid-cols-2 mt-2`}>
          <InputBox type="submit">
            <span class={tw`text-green-700 hover:text-green-500`}>
              approve
            </span>
          </InputBox>
          <InputBox type="submit" onClick={() => deny = true}>
            <span class={tw`text-red-700 hover:text-red-500`}>deny</span>
          </InputBox>
        </div>
        <div
          class={tw
            `flex flex-col-reverse h-48 mt-2 py-2 px-4 ${BORDER_CLASSES} bg-gray-50 overflow-y-auto w-full`}
        >
          {results.map((res: Checked & ApproveStatus) => (
            <div
              class={tw
                `flex flex-row justify-around w-full mb-2 py-2 px-4 space-x-4 ${BORDER_CLASSES} bg-gray-100 font-medium`}
            >
              {res.ok
                ? (
                  <span class={tw`text-green-700`}>
                    Successfully {deny ? "denied" : "approved"} {res.alias} by
                    {" "}
                    {usersCache[res.owner].login}
                  </span>
                )
                : <span class={tw`text-red-700`}>{res.error!}</span>}
            </div>
          ))}
        </div>
      </form>
    </Layout>
  );
}

export const config: PageConfig = { runtimeJS: true };
