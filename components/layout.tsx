import { ComponentChildren, h, JSX } from "../deps.ts";
import { Footer } from "./footer.tsx";

export function Layout(
  { children, title, description }: {
    children: ComponentChildren;
    title: string;
    description?: boolean;
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
        <div
          className="max-w-screen-xl mx-auto px-4 pt-6 lg:pt-10 pb-3 lg:pb-6 flex flex-col items-center"
        >
          <a href="/">
            <h1
              className="font-bold text-4xl lg:text-5xl leading-10 tracking-tight text-gray-900"
            >
              crux.land
            </h1>
          </a>
          {description
            ? <h2
              class="mt-2 font-light text-xl lg:text-2xl text-center leading-tight text-gray-900"
            >
              A <strong class="font-semibold">free open-source registry</strong>
              {" "}
              for <strong class="font-semibold">permanently</strong>{" "}
              hosting small scripts
            </h2>
            : null}
          <div className="mt-2 flex flex-row space-x-4">
            <a href="/api">Api</a>
            <a href="/alias">Alias</a>
            <a href="/api/login">Login</a>
          </div>
        </div>

        {children}

        <Footer />
      </body>
    </html>
  );
}
