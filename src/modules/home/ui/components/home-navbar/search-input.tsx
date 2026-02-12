"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { APP_URL } from "@/constants";
import { SearchIcon, XIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function SearchInput() {
  return (
    <Suspense fallback={<Skeleton className="h-10 w-full" />}>
      <SearchInputSuspense />
    </Suspense>
  );
}

function SearchInputSuspense() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const [value, setValue] = useState(query);
  const router = useRouter();
  // in client components we can get search queries from useSearchParams hook

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // as soon as user wrote a character in the input, redirect user to a place for showing result
    const url = new URL("/search", APP_URL);

    const newQuery = value.trim();
    url.searchParams.set("query", encodeURIComponent(newQuery)); //inside my url make a searchQuery name "query" and encoded it

    if (categoryId) url.searchParams.set("categoryId", categoryId);

    if (newQuery === "") {
      url.searchParams.delete("query"); //if user didnt write anything, delete query from URL
    }

    setValue(newQuery);
    router.push(url.toString()); // redirect users to a place for showing result (mydomain.com/search?query=abc)
  }

  return (
    <form className="flex w-full max-w-[600px]" onSubmit={handleSearch}>
      <div className="relative w-full">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          name="search"
          type="text"
          placeholder="Search"
          className="w-full pl-4 py-2 pr-12 rounded-l-full border focus:outline-none focus:ring-blue-500 focus:ring-1"
        />
        {value && (
          <Button
            disabled={!value.trim()}
            onClick={() => setValue("")}
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
          >
            <XIcon className="text-gray-500 size-5" />
          </Button>
        )}
      </div>
      <button
        className="bg-gray-100 px-5 py-2 border border-l-0 rounded-r-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        type="submit"
      >
        <SearchIcon className="text-gray-500 size-5" />
      </button>
    </form>
  );
}

export default SearchInput;
