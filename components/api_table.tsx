/** @jsx h */
import { h, tw } from "../deps.ts";
import { BORDER_CLASSES } from "./layout.tsx";

export interface Item {
  type: string | Record<string, Item>;
  description: string;
}

export interface ApiBody {
  // deno-lint-ignore camelcase
  content_type: string;
  content: Record<string, Item> | Item;
}

export function ApiTable(
  // deno-lint-ignore camelcase
  { content_type, content }: ApiBody,
) {
  return (
    <div class={tw`my-2 ml-1`}>
      <div class={tw`font-semibold text-gray-700 mb-1`}>
        Content-Type: <span class={tw`font-mono`}>{content_type}</span>
      </div>
      <div class={tw`${BORDER_CLASSES} w-full lg:w-9/12`}>
        <table class={tw`table-fixed border-collapse text-left w-full`}>
          <thead>
            <tr class={tw`bg-gray-200 font-mono border-b border-gray-400`}>
              <th class={tw`w-2/12 pl-1 py-1.5`}>NAME</th>
              <th class={tw`w-2/12 py-1.5`}>TYPE</th>
              <th class={tw`w-8/12 py-1.5`}>DESCRIPTION</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(content).map(
              ([key, { type, description }], i) => {
                return (
                  <tr class={i % 2 ? tw`bg-gray-200` : tw`bg-gray-300`}>
                    <td class={tw`pl-1 py-1.5 font-mono`}>{key}</td>
                    <td class={tw`py-1.5 font-mono`}>{type}</td>
                    <td class={tw`py-1.5`}>{description}</td>
                  </tr>
                );
              },
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
