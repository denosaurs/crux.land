import { h } from "../deps.ts";

export interface Item {
  type: string | Record<string, Item>;
  description: string;
}

export interface ApiBody {
  content_type: string;
  content: Record<string, Item> | Item;
}

export function ApiTable(
  { content_type, content }: ApiBody,
) {
  return (
    <div class="my-2 ml-1">
      <div class="font-semibold text-gray-700 mb-1">
        Content-Type: <span class="font-mono">{content_type}</span>
      </div>
      <div class="border border-gray-300 rounded-md w-full lg:w-9/12">
        <table class="table-fixed border-collapse text-left w-full">
          <thead>
            <tr class="bg-gray-200 font-mono border-b border-gray-400">
              <th class="w-2/12 pl-1 py-1.5">NAME</th>
              <th class="w-2/12 py-1.5">TYPE</th>
              <th class="w-8/12 py-1.5">DESCRIPTION</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(content).map(
              ([key, { type, description }], i) => {
                return (
                  <tr class={i % 2 ? "bg-gray-200" : "bg-gray-300"}>
                    <td class="pl-1 py-1.5 font-mono">{key}</td>
                    <td class="py-1.5 font-mono">{type}</td>
                    <td class="py-1.5">{description}</td>
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
