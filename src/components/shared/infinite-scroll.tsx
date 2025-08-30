"use client";

import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useEffect } from "react";
import { Button } from "../ui/button";
import { Loader2Icon } from "lucide-react";

interface InfiniteScrollProps {
  isManual?: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

function InfiniteScroll({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isManual = false,
}: InfiniteScrollProps) {
  const { isIntersecting, targetRef } = useIntersectionObserver({
    threshold: 0.5,
    rootMargin: "100px",
  });

  // here we decide we call fetchNextPage() or not
  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage && !isManual) {
      fetchNextPage(); //intersection observer fetches next 5 data
    }
  }, [
    isIntersecting,
    fetchNextPage,
    isFetchingNextPage,
    isManual,
    hasNextPage,
  ]);

  return (
    <div className="flex flex-col gap-4 p-4 items-center">
      {/* observer looks for this div element if user reches this div elent in the ui the observer will call a function */}
      <div className="h-1" ref={targetRef} />
      {hasNextPage ? (
        <Button
          variant="secondary"
          disabled={isFetchingNextPage || !hasNextPage}
          onClick={fetchNextPage}
        >
          {isFetchingNextPage && <Loader2Icon className="animate-spin" />}
          {isFetchingNextPage ? "Loading..." : "Load more"}
        </Button> //manually load data in case there is problem with intersection
      ) : (
        <p className="text-xs text-muted-foreground">
          You have reached end of list
        </p>
      )}
    </div>
  );
}

export default InfiniteScroll;
