import CategoriesSection from "../sections/categories-section";
import ResultSection from "../sections/result-section";

interface SearchViewProps {
  query: string | undefined;
  categoryId: string | undefined;
}

function SearchView({ categoryId, query }: SearchViewProps) {
  return (
    <div className="max-w-[1300px] mx-auto flex flex-col gap-y-6 px-4 py-2.5">
      <CategoriesSection categoryId={categoryId} />
      <ResultSection query={query} categoryId={categoryId} />
    </div>
  );
}

export default SearchView;
