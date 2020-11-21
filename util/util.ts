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
