"use client";

import FilterCarousel from "@/components/shared/filter-carousel";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface CategoriesSectionProps {
  categoryId?: string;
}

function CategoriesSection({ categoryId }: CategoriesSectionProps) {
  return (
    <Suspense fallback={<CategoriesSkeleton />}>
      <ErrorBoundary fallback={<p>Error: somethimg went wrong</p>}>
        <CategoriesSectionSuspense categoryId={categoryId} />
      </ErrorBoundary>
    </Suspense>
  );
}
export default CategoriesSection;

function CategoriesSectionSuspense({ categoryId }: CategoriesSectionProps) {
  const [categories] = trpc.categories.getMany.useSuspenseQuery();
  const router = useRouter();

  const data = categories.map((category) => ({
    value: category.id, //id is the same as value
    label: category.name, //name is the same as label
  }));

  function onSelect(value: string | null) {
    // value === categoryId or item.value
    // alternative we can use useRouter and useSearchParams hooks
    const url = new URL(window.location.href);
    if (value) url.searchParams.set("categoryId", value); // create query string name "categoryId" in url and set value to it

    if (!value) url.searchParams.delete("categoryId"); //if value is falsy, delete query string "categoryId" from url
    // whole page will reload
    /* window.location.href = url.toString();*/ //wehen we click on each category item, its categoryId(item.value) will be set in url
    router.push(url.toString()); // better for ux and performance bcs it is like SPA without page reloads
  }

  return <FilterCarousel onSelect={onSelect} data={data} value={categoryId} />;
}

function CategoriesSkeleton() {
  return <FilterCarousel onSelect={() => {}} data={[]} isLoading />;
}
