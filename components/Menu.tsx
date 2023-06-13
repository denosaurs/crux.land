import { useSignedIn } from "./Layout.tsx";

export function Menu() {
    const signedIn = useSignedIn();
  
    return (
      <div class="mt-2 flex flex-row space-x-4">
        <a href="/api">Api</a>
        {signedIn.user && <a href="/alias">Alias</a>}
        {signedIn.user?.admin && <a href="/admin">Admin</a>}
        {!signedIn.user && <a href="/api/login">Login</a>}
        {signedIn.user && (
          <a href="javascript:void(0);" onClick={signedIn.logout}>
            Logout
          </a>
        )}
      </div>
    );
  }