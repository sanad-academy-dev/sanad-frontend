"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export function useSearchQuery() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const initialQuery = searchParams?.get("q") || "";
  const [query, setQueryState] = useState(initialQuery);

  useEffect(() => {
    setQueryState(searchParams?.get("q") || "");
  }, [searchParams]);

  const setQuery = useCallback(
    (newQuery: string | null) => {
      const val = newQuery ?? "";
      setQueryState(val);
      const params = new URLSearchParams(searchParams?.toString() || "");
      if (val) {
        params.set("q", val);
      } else {
        params.delete("q");
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  return { query, setQuery };
}
