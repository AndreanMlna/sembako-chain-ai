"use client";

import { Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useDebounce } from "@/hooks";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  defaultValue?: string;
  className?: string;
}

export default function SearchBar({
  placeholder = "Cari...",
  onSearch,
  defaultValue = "",
  className = "",
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const debouncedQuery = useDebounce(query, 300);
  const onSearchRef = useRef(onSearch);
  const prevQueryRef = useRef(defaultValue);

  // Keep latest onSearch callback ref without re-triggering effect
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  // Trigger search on debounced value safely inside effect
  useEffect(() => {
    if (prevQueryRef.current !== debouncedQuery) {
      prevQueryRef.current = debouncedQuery;
      onSearchRef.current(debouncedQuery);
    }
  }, [debouncedQuery]);

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
      />
    </div>
  );
}
