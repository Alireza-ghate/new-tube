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
      {/* if based on user's query there was a result, show infinite scroll and result items if not show No video found */}
      {results.pages.flatMap((page) => page.items).length ? (
        <InfiniteScroll
          fetchNextPage={resultQuery.fetchNextPage}
          hasNextPage={resultQuery.hasNextPage}
          isFetchingNextPage={resultQuery.isFetchingNextPage}
        />
      ) : (
        <p className="text-center text-base font-semibold text-muted-foreground">
          No video found
        </p>
      )}
    </>
  );
}

function ResultSection(props: ResultSectionProps) {
  return (
    // we defined a key prop in suspense in order to force the resultSection to re-render as soon as categoryId or query changes
    <Suspense
      key={`${props.categoryId}-${props.query}`}
      fallback={<ResultSectionSkeleton />}
    >
      <ErrorBoundary fallback={<p>error...</p>}>
        <ResultSectionSuspense {...props} />
      </ErrorBoundary>
    </Suspense>
  );
}

export default ResultSection;

function ResultSectionSkeleton() {
  return (
    <div>
      {/* desktop version */}
      <div className="hidden md:flex flex-col gap-4">
        {Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
          <VideoRowCardSkeleton key={index} />
        ))}
      </div>
      {/* mobile version */}
      <div className="flex md:hidden flex-col gap-y-10 gap-x-4 p-4 pt-6">
        {Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
          <VideoGridCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
