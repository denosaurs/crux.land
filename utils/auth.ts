import { encode } from "$std/encoding/base64url.ts";
import { Velo } from "velo";

const LOGIN_STATE_TTL = 1000 * 60 * 10; // 10 Minutes

export interface LoginState {
  redirect?: string | URL;
}

export const loginState = Velo.builder<string, LoginState>()
  .capacity(1000)
  .ttl(LOGIN_STATE_TTL)
  .lru()
  .build();

export function createLoginState(redirect?: string | URL): string {
  const nonceBytes = new Uint8Array(32);
  crypto.getRandomValues(nonceBytes);
  const nonce = encode(nonceBytes);
  loginState.set(nonce, { redirect });
  return nonce;
}
