import { h } from "../deps.ts";

export function Link({ children, ...props }) {
  return (<a {...props}>{children}</a>);
}
