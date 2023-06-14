import { ComponentChildren } from "preact";

export function Navigation() {
  return (
    <nav class="flex justify-between font-bold text-1xl lg:text-2xl">
      <a class="hover:(animate-once animate-pulse)" href="">ALIAS</a>
      <a class="hover:(animate-once animate-pulse)" href="">API</a>
      <a class="hover:(animate-once animate-pulse)" href="">ADMIN</a>
      <a class="hover:(animate-once animate-pulse)" href="">LOGIN</a>
    </nav>
  )
}

// This should be an island
export function Upload() {
  return (
    <button>
      UPLOAD
    </button>
  )
}

export function Header() {
  return (
    <header class="flex flex-col sticky top-0 w-full bg-secondary z-50 pb-4 gap-4 border-b-2 border-primary">
      <div class="flex justify-center uppercase tracking-tighter font-bold text-4xl lg:text-8xl animate-jump">crux.land</div>
      <Navigation />
      <Upload />
    </header>
  );
}
