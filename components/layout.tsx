import { h, JSX } from "../deps.ts";
import { Footer } from "./footer.tsx";
import { Header } from "./header.tsx";

export function Layout(
  { children, title, header }: {
    // deno-lint-ignore no-explicit-any
    children: any;
    title: string;
    header?: boolean;
  },
) {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <title>{title}</title>
        <link
          href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css"
          rel="stylesheet"
        />
      </head>
      <body>
        {header ? <Header /> : null}
        {children}
        <Footer />
      </body>
    </html>
  );
}
