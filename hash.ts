export function fnv1a(data: string): number {
  data = unescape(encodeURIComponent(data));

  let hash = 2166136261;

  for (const code of data) {
    hash ^= code.charCodeAt(0);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }

  return hash >>> 0;
}

