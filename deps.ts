/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.unstable" />
/// <reference lib="deno.ns" />

export * from "https://raw.githubusercontent.com/lucacasonato/fresh/aa1e1bcdb4693610feb3eb4ad7bba460c54cacaf/runtime.ts";

// twind
export { setup, tw } from "https://esm.sh/twind@0.16.16";
export {
  getStyleTagProperties,
  virtualSheet,
} from "https://esm.sh/twind@0.16.16/sheets";

// Font Awesome
export { FontAwesomeIcon } from "https://esm.sh/@fortawesome/react-fontawesome@0.1.16";
export {
  faDiscord,
  faGithub,
  faTwitter,
} from "https://esm.sh/@fortawesome/free-brands-svg-icons@5.15.4";

// Prism
import PrismExports from "https://jspm.dev/prism-react-renderer@1.2.0";
// @ts-ignore TS2339
export const Highlight = PrismExports.default;
export { Prism } from "https://jspm.dev/prism-react-renderer@1.2.0";
export { default as theme } from "https://jspm.dev/prism-react-renderer@1.2.0/themes/github";
