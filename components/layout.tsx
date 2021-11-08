/** @jsx h */
import { ComponentChildren, Fragment, h, tw } from "../deps.ts";
import { Footer } from "./footer.tsx";

export function Layout(
  { children, description, script, style }: {
    children: ComponentChildren;
    description?: boolean;
    script?: string;
    style?: string;
  },
) {
  return (
    <Fragment>
      <div
        class={tw
          `max-w-screen-xl mx-auto px-4 pt-6 lg:pt-10 pb-3 lg:pb-6 flex flex-col items-center`}
      >
        <a href="/">
          <h1
            class={tw
              `font-bold text-4xl lg:text-5xl leading-10 tracking-tight text-gray-900`}
          >
            crux.land
          </h1>
        </a>
        {description
          ? (
            <h2
              class={tw
                `mt-2 font-light text-xl lg:text-2xl text-center leading-tight text-gray-900`}
            >
              A{" "}
              <strong class={tw`font-semibold`}>
                free open-source registry
              </strong>{" "}
              for <strong class={tw`font-semibold`}>permanently</strong>{" "}
              hosting small scripts
            </h2>
          )
          : null}
        <div class={tw`mt-2 flex flex-row space-x-4`}>
          <a href="/api">Api</a>
          <a href="/alias" id="alias" hidden>Alias</a>
          <a href="/admin" id="admin" hidden>Admin</a>
          <a href="/api/login" id="login" hidden>Login</a>
          <a
            href="javascript:void(0);"
            // @ts-ignore TS2322
            onclick="logout()"
            id="logout"
            hidden
          >
            Logout
          </a>
        </div>
      </div>

      {children}

      <Footer />

      <script>
        {`
          function getUser() {
            return JSON.parse(localStorage.getItem('user'));
          }
          function logout() {
            localStorage.clear();
            reloadUser();
          }
          function reloadUser() {
            const url = new URL(document.URL);
            const json = new URLSearchParams(url.search).get('user');

            if (json !== null) {
              localStorage.setItem('user', decodeURIComponent(json));
              location.href = url.origin + url.pathname;
            }

            const login = document.getElementById('login');
            const logout = document.getElementById('logout');
            const alias = document.getElementById('alias');
            const admin = document.getElementById('admin');
            const user = getUser();

            if (user === null) {
              login.hidden = false;
              logout.hidden = true;
              alias.hidden = true;
              admin.hidden = true;
            } else {
              login.hidden = true;
              logout.hidden = false;
              alias.hidden = false;
              admin.hidden = !user.admin;
            }
          }
          reloadUser();
        `}
      </script>
      {script
        ? <script dangerouslySetInnerHTML={{ __html: script }}></script>
        : null}
      {style ? <style dangerouslySetInnerHTML={{ __html: style }}></style>
      : null}
    </Fragment>
  );
}
