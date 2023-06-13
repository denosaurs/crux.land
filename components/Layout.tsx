import { ComponentChildren } from "preact";

export interface LayoutProps {
  children: ComponentChildren;
}

export function Layout({ children }: LayoutProps) {
  return (
    <main class="flex flex-col max-w-screen-lg min-h-full mx-auto p-8 rounded-lg border-1 border-primary bg-secondary active:border-hidden">
      {children}
    </main>
  );
}
