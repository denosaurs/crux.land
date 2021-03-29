import { h } from "../deps.ts";

export function Link({ children, ...props }: { children: any }) {
  return (<a {...props}>{children}</a>);
}
