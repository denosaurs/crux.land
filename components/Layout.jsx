import { h } from "../deps.ts";
import { Footer } from "./footer.jsx";
import { Header } from "./header.jsx";

export function Layout({ title, header, children }) {
  return (
    <html>
      <head>
        <meta charset="UTF-8" />
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
