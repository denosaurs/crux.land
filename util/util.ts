const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function getBoundry(headers: Headers) {
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

export function encodeUTF8(text: string): Uint8Array {
  return encoder.encode(text);
}

export function decodeUTF8(arr: Uint8Array): string {
  return decoder.decode(arr);
}

export function prependUTF8(arr: Uint8Array, text: string): Uint8Array {
  return new Uint8Array([...encodeUTF8(text), ...arr]);
}

export function equal(a: Uint8Array, b: Uint8Array): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}
