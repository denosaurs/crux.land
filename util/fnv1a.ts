/**
 * Calculates the fnv1a hash of a given array of bytes.
 * https://softwareengineering.stackexchange.com/questions/49550/which-hashing-algorithm-is-best-for-uniqueness-and-speed
 */
export function fnv1a(data: Uint8Array): number {
  let hash = 2166136261;

  for (const code of data) {
    hash ^= code;
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) +
      (hash << 24);
  }

  return hash >>> 0;
}
