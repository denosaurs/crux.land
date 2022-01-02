/** @jsx h */
import {
  ComponentChildren,
  createContext,
  h,
  tw,
  useContext,
  useEffect,
  useState,
} from "../deps.ts";
import { Footer } from "./footer.tsx";
import { Menu } from "./menu.tsx";

export const BORDER_CLASSES = "border border-gray-300 rounded-md";

export interface User {
  secret: string;
  admin: boolean;
  id: string;
}

export interface AuthState {
  user: User | undefined;
  logout(): void;
}

export const AuthContext = createContext<AuthState>({
  user: undefined,
  logout() {
    console.error("Not logged in, cant logout.");
  },
});

export function useSignedIn(): AuthState {
  return useContext(AuthContext);
}

export function Layout(
  { children, description }: {
    children: ComponentChildren;
    description?: boolean;
  },
) {
  const storedUser = typeof Deno !== "undefined"
    ? null
    : localStorage.getItem("user");

  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    if (typeof storedUser === "string") {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(undefined);
    }
  }, [storedUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        logout() {
          localStorage.clear();
          location.href = location.origin;
        },
      }}
    >
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
        {description && (
          <h2
            class={tw
              `mt-2 font-light text-xl lg:text-2xl text-center leading-tight text-gray-900`}
          >
            A{" "}
            <strong class={tw`font-semibold`}>free open-source registry</strong>
            {" "}
            for <strong class={tw`font-semibold`}>permanently</strong>{" "}
            hosting small scripts
          </h2>
        )}
        <Menu />
      </div>

      <div class={tw`max-w-screen-sm lg:max-w-screen-lg mx-auto px-4 mt-4`}>
        {children}
      </div>

      <Footer />
    </AuthContext.Provider>
  );
}
