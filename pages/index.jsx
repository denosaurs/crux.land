import { h } from "../deps.ts";
import { Layout } from "../components/layout.jsx";
import { Block } from "../components/block.jsx";
import { LabelButton } from "../components/label_button.jsx";
import { InputButton } from "../components/input_button.jsx";
import { ResultButton } from "../components/result_button.jsx";
import { EXTENSIONS } from "../util/constants.ts";

export function Index() {
  return (
    <Layout title="crux.land" header>
      <Block>
        <div className="flex flex-col lg:flex-row">
          <div className="inset-y-0 left-0 w-full lg:w-3/5">
            crux.land is a free registry service meant for hosting small ( &#60;
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
              onreset="
                const label = document.getElementById('label');
                label.innerText = 'Choose a script';
              "
              onsubmit="
                const form = document.getElementById('form');
                const submit = document.getElementById('submit');
                const result = document.getElementById('result');

                event.preventDefault();

                result.style.display = 'none';

                submit.disabled = true;
                submit.value = 'Uploading...';

                const res = fetch('/api/add', {
                  method: 'POST',
                  body: new FormData(form),
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
              "
            >
              <input
                type="file"
                name="file"
                id="file"
                accept={EXTENSIONS.map((ext) => "." + ext).join(",")}
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
                <LabelButton id="label" htmlFor="file">
                  Choose a script
                </LabelButton>
              </div>
              <div className="mb-2 mt-2">
                <InputButton
                  type="submit"
                  name="submit"
                  id="submit"
                  value="Upload"
                />
              </div>
            </form>
            <div className="select-all cursor-text">
              <ResultButton id="result"></ResultButton>
            </div>
          </div>
        </div>
      </Block>
    </Layout>
  );
}
