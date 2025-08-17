import { SearchIcon } from "lucide-react";

function SearchInput() {
  return (
    <form className="flex w-full max-w-[600px]">
      <div className="relative w-full">
        <input
          name="search"
          type="text"
          placeholder="Search"
          className="w-full pl-4 py-2 pr-12 rounded-l-full border focus:outline-none focus:ring-blue-500 focus:ring-1"
        />
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
