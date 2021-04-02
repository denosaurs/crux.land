import { h } from "../deps.ts";
import { Layout } from "../components/layout.tsx";
import { Block } from "../components/block.tsx";
import { LabelButton } from "../components/label_button.tsx";
import { InputButton } from "../components/input_button.tsx";
import { ResultButton } from "../components/result_button.tsx";
import { EXTENSIONS } from "../util/constants.ts";

export function Index() {
  return (
    <Layout title="crux.land" description>
      <Block>
        <div className="flex flex-col lg:flex-row">
          <div className="inset-y-0 left-0 w-full lg:w-3/5">
            crux.land is a free registry service meant for hosting small (≤
            10kB) single deno scripts. All uploaded scripts are immutable and
            will not be changed nor deleted unless there is a legal reason or if
            it is found to be malicious.

            <br />
            <br />

            Usage... Dolor deserunt proident ex esse. Ex reprehenderit ex dolore
            aute irure adipisicing anim anim mollit. Aute nisi in sint mollit
            aute nisi nostrud dolor aliquip anim cillum Lorem et. Id est aute
            esse ea ea eiusmod laboris officia exercitation.

            <br />
            <br />

            A custom name may also be associated with your uploaded scripts.
            These aliases are versioned and can be updated with new versions
            unlike the raw links for a script which has not been aliased.
          </div>
          <div className="flex flex-col inset-y-0 right-0 w-full lg:w-2/5">
            <form
              className="m-0"
              id="form"
              // @ts-ignore TS2322
              onreset="
                const label = document.getElementById('label');
                label.innerText = 'Choose a script';
              "
              onsubmit="
                // Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
                function encode(data) {
                  const base64abc = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 
                    'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 
                    'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 
                    'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', 
                    '5', '6', '7', '8', '9', '+', '/'];
                  const uint8 = new Uint8Array(data);
                  let result = '',
                    i;
                  const l = uint8.length;
                  for (i = 2; i < l; i += 3) {
                    result += base64abc[uint8[i - 2] >> 2];
                    result += base64abc[((uint8[i - 2] & 0x03) << 4) | (uint8[i - 1] >> 4)];
                    result += base64abc[((uint8[i - 1] & 0x0f) << 2) | (uint8[i] >> 6)];
                    result += base64abc[uint8[i] & 0x3f];
                  }
                  if (i === l + 1) {
                    // 1 octet yet to write
                    result += base64abc[uint8[i - 2] >> 2];
                    result += base64abc[(uint8[i - 2] & 0x03) << 4];
                    result += '==';
                  }
                  if (i === l) {
                    // 2 octets yet to write
                    result += base64abc[uint8[i - 2] >> 2];
                    result += base64abc[((uint8[i - 2] & 0x03) << 4) | (uint8[i - 1] >> 4)];
                    result += base64abc[(uint8[i - 1] & 0x0f) << 2];
                    result += '=';
                  }
                  return result;
                }

                const form = document.getElementById('form');
                const file = document.getElementById('file');
                const submit = document.getElementById('submit');
                const result = document.getElementById('result');

                event.preventDefault();

                result.style.display = 'none';

                submit.disabled = true;
                submit.value = 'Uploading...';

                file.files[0].arrayBuffer().then((buf) => {
                  fetch('/api/add', {
                    method: 'POST',
                    body: JSON.stringify({
                      name: file.files[0].name,
                      content: encode(buf)
                    }),
                  }).then(async (res) => {
                    submit.disabled = false;
                    submit.value = 'Upload';

                    if (res.ok) {
                      res.json().then(({ id }) => {
                        result.style.color = 'rgba(55, 65, 81, var(--tw-text-opacity))';
                        result.innerText = window.location.href + id;
                      });
                    } else {
                      res.text().then(err => {
                        result.style.color = 'rgba(220, 38, 38, var(--tw-text-opacity))';
                        result.innerText = err;
                      });
                    }
                    result.style.display = 'flex';
                    form.reset();
                  });
                });
              "
            >
              <input
                type="file"
                name="file"
                id="file"
                accept={EXTENSIONS.map((ext) => "." + ext).join(",")}
                // @ts-ignore TS2322
                onchange="
                  const file = document.getElementById('file');
                  const label = document.getElementById('label');

                  if (file.files[0]) {
                    label.innerText = file.files[0].name;
                  } else {
                    label.innerText = 'Choose a script';
                  }
                "
                required
                hidden
              />
              <div className="mb-2 mt-4 lg:mt-0">
                <LabelButton
                  // @ts-ignore TS2322
                  id="label"
                  htmlFor="file"
                >
                  Choose a script
                </LabelButton>
              </div>
              <div className="mb-2 mt-2">
                <InputButton
                  // @ts-ignore TS2322
                  type="submit"
                  name="submit"
                  id="submit"
                  value="Upload"
                />
              </div>
            </form>
            <div className="select-all cursor-text">
              <ResultButton
                // @ts-ignore TS2322
                id="result"
              />
            </div>
          </div>
        </div>
      </Block>
    </Layout>
  );
}
