"use client";

import InfiniteScroll from "@/components/shared/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import { useIsMobile } from "@/hooks/use-mobile";
import VideoGridCard, {
  VideoGridCardSkeleton,
} from "@/modules/videos/ui/components/video-grid-card";
import VideoRowCard, {
  VideoRowCardSkeleton,
} from "@/modules/videos/ui/components/video-row-card";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface ResultSectionProps {
  query: string | undefined;
  categoryId: string | undefined;
}

function ResultSectionSuspense({ categoryId, query }: ResultSectionProps) {
  const isMobile = useIsMobile(); // to decide which VideRowCard render base on whether we are on mobile or not
  const [results, resultQuery] = trpc.search.getMany.useSuspenseInfiniteQuery(
    {
      query,
      categoryId,
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <>
      {isMobile ? (
        <div className="flex flex-col gap-y-10 gap-x-4">
          {results.pages
            .flatMap((page) => page.items)
            .map((video) => (
              <VideoGridCard data={video} key={video.id} />
            ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {results.pages
            .flatMap((page) => page.items)
            .map((video) => (
              <VideoRowCard key={video.id} data={video} />
            ))}
        </div>
      )}

      <InfiniteScroll
        fetchNextPage={resultQuery.fetchNextPage}
        hasNextPage={resultQuery.hasNextPage}
        isFetchingNextPage={resultQuery.isFetchingNextPage}
      />
    </>
  );
}

function ResultSection({ query, categoryId }: ResultSectionProps) {
  return (
    <Suspense fallback={<ResultSectionSkeleton />}>
      <ErrorBoundary fallback={<p>error...</p>}>
        <ResultSectionSuspense query={query} categoryId={categoryId} />
      </ErrorBoundary>
    </Suspense>
  );
}

export default ResultSection;

function ResultSectionSkeleton() {
  const isMobile = useIsMobile(); // to decide which VideRowCard render base on whether we are on mobile or not

  return (
    <>
      {isMobile ? (
        <div className="flex flex-col gap-y-10 gap-x-4">
          {Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
            <VideoGridCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
            <VideoRowCardSkeleton key={index} />
          ))}
        </div>
      )}
    </>
  );
}
