import { encode } from "./base58.ts";

/** Generates a random 32 bit token and encodes it as base58 */
export function generate(): string {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  const view = new DataView(arr.buffer);
  const u32 = view.getUint32(0);
  return encode(u32);
}
