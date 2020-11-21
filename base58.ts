const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

export function encode(data: number): string {
  let output = "";

  while (data > 0) {
    let remainder = data % 58;
    data = Math.floor(data / 58);
    output = alphabet[remainder] + output;
  }

  return output;
}

function validate(data: string): boolean {
  return new RegExp(`^[${alphabet}]*$`).test(data);
}

export function decode(data: string) {
  if (!validate(data)) throw "base58InvalidData";

  let output = 0;

  while (data) {
    output += alphabet.indexOf(data[0]) * (58 ** (data.length - 1));
    data = data.substring(1);
  }

  return output;
}
