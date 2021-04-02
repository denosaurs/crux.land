import { ComponentChildren, h, JSX } from "../deps.ts";

export function Link(
  { children, href }: {
    children: ComponentChildren;
    href: string;
  },
) {
  return (<a href={href}>{children}</a>);
}
