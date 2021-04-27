import { h } from "../deps.ts";
import { Layout } from "../components/layout.tsx";
import { Block } from "../components/block.tsx";
import { LabelButton } from "../components/label_button.tsx";
import { InputButton } from "../components/input_button.tsx";
import { ResultButton } from "../components/result_button.tsx";
import { CodeInline } from "../components/code_inline.tsx";
import { EXTENSIONS } from "../util/constants.ts";

export function Index() {
  return (
    <Layout
      title="crux.land"
      description
    >
      <Block>
        <div className="flex flex-col lg:flex-row">
          <div className="inset-y-0 left-0 w-full lg:w-3/5">
            crux.land is a free registry service meant for hosting small (≤
            10kB) single deno scripts. All uploaded scripts are immutable and
            will not be changed nor deleted unless there is a legal reason or if
            it is found to be malicious.

            <br />
            <br />

            To use crux.land simply upload a file with one of the supported file
            extensions ({EXTENSIONS.map((ext, idx) =>
              <span>
                <CodeInline>{ext}</CodeInline>
                {EXTENSIONS.length - 1 === idx ? "" : ", "}
              </span>
            )}) and if successful you will recieve a permanent link to said
            file. This link may be used in deno or browsers import and
            automatically serve the correct{" "}
            <CodeInline>Content-Type</CodeInline>{" "}
            header. An optional extension may be added to the end of the url but
            is not necessary as it is automatically redirected to.

            <br />
            <br />

            A custom name may also be requested to be associated with your
            uploaded scripts. These aliases are versioned and can be updated
            with new tags unlike the raw links for a script which are permanent
            and therefor not versioned. To request an alias a GitHub account
            login is required to prevent abuse.
          </div>
          <div className="flex flex-col inset-y-0 right-0 w-full lg:w-2/5">
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
            <div className="mb-2 mt-2 lg:mt-0">
              <InputButton
                // @ts-ignore TS2322
                type="button"
                name="submit"
                id="submit"
                value="Upload"
                onclick="
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

                  const file = document.getElementById('file');
                  const submit = document.getElementById('submit');
                  const result = document.getElementById('result');
                  const label = document.getElementById('label');

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
                        res.json().then(({ error }) => {
                          result.style.color = 'rgba(220, 38, 38, var(--tw-text-opacity))';
                          result.innerText = error;
                        });
                      }
                      result.style.display = 'flex';

                      label.innerText = 'Choose a script';
                    });
                  });
                "
              />
            </div>
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
