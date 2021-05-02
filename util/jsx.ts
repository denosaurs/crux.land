import {
  getStyleTag,
  renderToString,
  setup,
  shim,
  virtualSheet,
  VNode,
} from "../deps.ts";
import { html } from "./responses.ts";

const sheet = virtualSheet();
setup({ sheet, mode: "silent" });

export function jsx(body: VNode, head: VNode, init?: ResponseInit): Response {
  sheet.reset();

  const bodyHTML = shim(renderToString(body));
  const style = getStyleTag(sheet);
  const headHTML = renderToString(head);

  return html(
    `
    <!DOCTYPE html>
    <html>
      <head>${headHTML} ${style}</head>
      <body>${bodyHTML}</body>
    </html>
  `,
    init,
  );
}
