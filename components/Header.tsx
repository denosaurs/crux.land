import { ComponentChildren } from "preact";
import Button from "~/islands/Button.tsx";
import { EXTENSIONS } from "../utils/constants.ts";

export interface NavigationProps {
  // role: UserRole;
  authenticated: boolean;
}

export function Navigation({ authenticated }: NavigationProps) {
  return (
    <nav class="flex justify-between font-bold text-1xl lg:text-2xl">
      <a class="hover:(animate-once animate-pulse)" href="">Alias</a>
      {/* <a class="hover:(animate-once animate-pulse)" href="">API</a> */}
      {/* <a class="hover:(animate-once animate-pulse)" href="">ADMIN</a> */}
      <a
        class="hover:(animate-once animate-pulse)"
        href={authenticated ? "/api/auth/logout" : "/api/auth/github/login"}
      >
        {authenticated ? "Logout" : "Login"}
      </a>
    </nav>
  );
}

// This should be an island
export function Upload() {
  return (
    <div class="flex items-center justify-center">
      <Button/>
    </div>
  );
}

export interface HeaderProps {
  // role: UserRole;
  authenticated: boolean;
}

export function Header({ authenticated }: HeaderProps) {
  return (
    <header class="flex flex-col sticky top-0 w-full bg-secondary z-50 pb-4 gap-4 border-b-2 border-primary">
      <div class="flex justify-center uppercase tracking-tighter font-bold text-4xl lg:text-8xl animate-jump">
        crux.land
      </div>
      <Navigation authenticated={authenticated} />
      <Upload />
    </header>
  );
}
