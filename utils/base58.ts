import { BASE58_ALPHABET } from "./constants.ts";

/** Encodes a number as a base58 string */
export function encode(data: number): string {
  let output = "";

  if (data === 0) {
    return BASE58_ALPHABET[data];
  }

  while (data > 0) {
    const remainder = data % 58;
    data = Math.floor(data / 58);
    output = BASE58_ALPHABET[remainder] + output;
  }

  return output;
}

/** Validates that the given string is a valid base58 string */
export function validate(data: string): boolean {
  return new RegExp(`^[${BASE58_ALPHABET}]*$`).test(data);
}

/** Decodes a base58 string to encoded number */
export function decode(data: string): number {
  let output = 0;

  while (data) {
    output += BASE58_ALPHABET.indexOf(data[0]) * (58 ** (data.length - 1));
    data = data.substring(1);
  }

  return output;
}
