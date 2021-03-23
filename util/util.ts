const encoder = new TextEncoder();
const decoder = new TextDecoder();

/** Gets the mime boundry from provided Headers */
export function getMimeBoundry(headers: Headers): string | undefined {
  const value = headers.get("content-type")!;
  const params = new Map();

  value
    .split(";")
    .slice(1)
    .map((s) => s.trim().split("="))
    .filter((arr) => arr.length > 1)
    .map(([k, v]) => [k, v.replace(/^"([^"]*)"$/, "$1")])
    .forEach(([k, v]) => params.set(k, v));

  return params.get("boundary");
}

/** Escapes unsafe html characters in a string */
export function escapeHTML(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/** Encodes a string to an Uint8Array */
export function encodeUTF8(text: string): Uint8Array {
  return encoder.encode(text);
}

/** Encodes an Uint8Array to a string */
export function decodeUTF8(arr: Uint8Array): string {
  return decoder.decode(arr);
}

/** Prepends a string encoded as UTF8 to an Uint8Array */
export function prependUTF8(arr: Uint8Array, text: string): Uint8Array {
  return new Uint8Array([...encodeUTF8(text), ...arr]);
}

/** Checks if Uint8Arrays are equal */
export function uint8ArraysEqual(
  a: Uint8Array | undefined,
  b: Uint8Array | undefined,
): boolean {
  return a === undefined || b === undefined ||
    (a.length === b.length && a.every((v, i) => v === b[i]));
}

/** Concatinates a number of Uint8Arrays */
export function uint8ArraysConcat(...arrs: Uint8Array[]): Uint8Array {
  const len = arrs.reduce((acc, val) => acc + val.length, 0);
  const result = new Uint8Array(len);

  let offset = 0;
  for (const arr of arrs) {
    result.set(arr, offset);
    offset += arr.length;
  }

  return result;
}

/** Reads a ReadableStream<Uint8Array> to completion into a Uint8Array */
export async function readToUint8Array(
  stream: ReadableStream<Uint8Array>,
): Promise<Uint8Array> {
  const data = [];

  for await (const part of stream) {
    data.push(part);
  }

  return uint8ArraysConcat(...data);
}
