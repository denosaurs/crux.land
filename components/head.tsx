import { Fragment, h } from "../deps.ts";

export function Head({ title }: { title: string } = { title: "crux.land" }) {
  return (
    <Fragment>
      <meta charSet="UTF-8" />
      <title>{title}</title>
    </Fragment>
  );
}
