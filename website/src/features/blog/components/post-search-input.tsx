"use client";

import { useEffect } from "react";
import { Search, X } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useSearchQuery } from "../hooks/use-search-query";

export function PostSearchInput() {
  const { query, setQuery } = useSearchQuery();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && query) {
        setQuery(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [query, setQuery]);

  return (
    <InputGroup className="rounded-lg shadow-none">
      <InputGroupInput
        dir="rtl"
        placeholder="ابحث في مقالات المدونة…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
      />

      <InputGroupAddon align="inline-start">
        <Search className="size-4 text-muted-foreground" />
      </InputGroupAddon>

      {query.length > 0 && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            className="rounded-sm border-none cursor-pointer shadow-none"
            size="icon-xs"
            title="مسح البحث"
            aria-label="مسح البحث"
            onClick={() => setQuery(null)}
          >
            <X className="size-3.5" />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
