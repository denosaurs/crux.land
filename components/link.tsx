import { h, JSX } from "../deps.ts";

export function Link({ children, ...props }: { children: JSX.Element }) {
  return (<a {...props}>{children}</a>);
}
