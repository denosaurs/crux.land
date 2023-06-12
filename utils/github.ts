import { config } from "~/config.ts";

export class GitHubAuthError extends Error {}

export async function fetchAccessToken(
  code: string,
  state?: string,
): Promise<string> {
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    body: JSON.stringify({
      client_id: config.GITHUB_CLIENT_ID,
      client_secret: config.GITHUB_CLIENT_SECRET,
      code,
      state,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new GitHubAuthError(await response.text());
  }

  const data = await response.json();
  const accessToken = data["access_token"];

  if (typeof accessToken !== "string") {
    throw new GitHubAuthError("Access token was not a string.");
  }

  return accessToken;
}

export async function fetchUserData(
  accessToken: string,
): Promise<{ id: number; name: string }> {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `token ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new GitHubAuthError(await response.text());
  }

  const userData = await response.json();

  return {
    id: userData.id as number,
    name: userData.login as string,
  };
}
