import { EXTENSIONS } from "~/utils/constants.ts";
import { HeaderProps } from "../components/Header.tsx";
async function onChange(authenticated: boolean) {
  if (!authenticated) {
    alert("You must be logged in to upload a script");
    return;
  }

  const file: HTMLInputElement = document.getElementById(
    "file",
  )! as HTMLInputElement;

  if (file.files![0]) {
    const formData = new FormData();
    formData.append("file", file.files![0]);
    try {
      const response = await fetch("/api/script", {
        method: "POST",
        body: formData,
      });
      const json = await response.json();
      if (!response.ok) {
        alert((json as { message: string }).message);
        throw new Error((json as { message: string }).message);
      }
      window.location.href = `/${(json as { id: string }).id}`;
      // deno-lint-ignore no-empty
    } catch {}
  }
}

export default function Button({ authenticated }: HeaderProps) {
  return (
    <>
      <form
        id="form"
        action="/api/script"
        method="post"
        encType="multipart/form-data"
      >
        <input
          type="file"
          name="file"
          id="file"
          accept={EXTENSIONS.map((ext) => "." + ext).join(",")}
          // @ts-ignore TS2322
          onchange={() => onChange(authenticated)}
          required
          hidden
        />
      </form>
      <label
        id="label"
        htmlFor="file"
        class="btn px-24 py-4 bg-primary text-secondary rounded hover:(animate-once animate-pulse)"
      >
        UPLOAD
      </label>
    </>
  );
}
