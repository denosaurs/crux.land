const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

export function encode(data: number): string {
  let output = "";

  while (data > 0) {
    const remainder = data % 58;
    data = Math.floor(data / 58);
    output = alphabet[remainder] + output;
  }

  return output;
}

export function validate(data: string): boolean {
  return new RegExp(`^[${alphabet}]*$`).test(data);
}

export function decode(data: string): number {
  let output = 0;

  while (data) {
    output += alphabet.indexOf(data[0]) * (58 ** (data.length - 1));
    data = data.substring(1);
  }

  return output;
}
