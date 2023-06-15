import { EXTENSIONS } from "~/utils/constants.ts";
import { decode, encode } from "https://deno.land/std/encoding/base64.ts";
function onChange() {
  const file: HTMLInputElement = document.getElementById(
    "file",
  )! as HTMLInputElement;
  const label: HTMLLabelElement = document.getElementById(
    "label",
  )! as HTMLLabelElement;
  label.innerText = file.files![0] ? file.files![0].name : "Choose a script";
  if (file.files![0]) {
    file.files![0].arrayBuffer().then((buf) => {
      const encodedFile = new File([buf], file.files![0].name, {
        type: file.files![0].type,
      });
    });
  }
}

export default function Button() {
  return (
    <>
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
