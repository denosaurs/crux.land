import { h, JSX } from "../deps.ts";

// deno-lint-ignore no-explicit-any
export function Link({ children, ...props }: { children: any }) {
  return (<a {...props}>{children}</a>);
}
