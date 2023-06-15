import { EXTENSIONS } from "~/utils/constants.ts";
async function onChange() {
  const file: HTMLInputElement = document.getElementById(
    "file",
  )! as HTMLInputElement;
  const label: HTMLLabelElement = document.getElementById(
    "label",
  )! as HTMLLabelElement;
  label.innerText = file.files![0] ? file.files![0].name : "Choose a script";
  if (file.files![0]) {
    const formData = new FormData();
    formData.append("file", file.files![0]);
    try {
      const response = await fetch("/api/script", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to upload file");
      }
      const res = (await response.json() as { id : string}).id;
      window.location.href = `/${res}`;
    } catch (error) {
      console.error(error);
    }
  }
}

export default function Button() {
  return (
    <>
    <form id="form" action="/api/script" method="post" encType="multipart/form-data">
      <input
        type="file"
        name="file"
        id="file"
        accept={EXTENSIONS.map((ext) => "." + ext).join(",")}
        // @ts-ignore TS2322
        onchange={onChange}
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
