import { useEffect, useState } from "../deps.ts";

export function useFetch<T, D = T>(def: D, cb: () => Promise<T>): D | T {
  const [val, setVal] = useState<D | T>(def);
  useEffect(() => {
    cb().then(setVal);
  }, []);
  return val;
}
