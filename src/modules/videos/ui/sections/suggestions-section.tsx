"use client";

import InfiniteScroll from "@/components/shared/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import VideoGridCard, {
  VideoGridCardSkeleton,
} from "../components/video-grid-card";
import VideoRowCard, {
  VideoRowCardSkeleton,
} from "../components/video-row-card";

interface SuggestionsSectionProps {
  videoId: string;
  isManual?: boolean;
}

function SuggestionsSectionSuspense({
  videoId,
  isManual,
}: SuggestionsSectionProps) {
  const [suggestions, query] =
    trpc.suggestions.getMany.useSuspenseInfiniteQuery(
      {
        limit: DEFAULT_LIMIT,
        videoId,
      },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    );
  return (
    <>
      {/* in large screens this will render */}
      <div className="hidden md:block space-y-3">
        {suggestions.pages.flatMap((page) =>
          page.items.map((video) => (
            <VideoRowCard size="compact" key={video.id} data={video} />
          ))
        )}
      </div>
      {/* in mobile screens this will render */}
      <div className="block md:hidden space-y-10">
        {suggestions.pages.flatMap((page) =>
          page.items.map((video) => (
            <VideoGridCard key={video.id} data={video} />
          ))
        )}
      </div>

      <InfiniteScroll
        isManual={isManual}
        fetchNextPage={query.fetchNextPage}
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
      />
    </>
  );
}

function SuggestionsSection({ videoId, isManual }: SuggestionsSectionProps) {
  return (
    <Suspense fallback={<SuggestionsSectionSkeleton />}>
      <ErrorBoundary fallback={<p>error...</p>}>
        <SuggestionsSectionSuspense videoId={videoId} isManual={isManual} />
      </ErrorBoundary>
    </Suspense>
  );
}

function SuggestionsSectionSkeleton() {
  return (
    <>
      {/* in large screens this will render */}
      <div className="hidden md:block space-y-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <VideoRowCardSkeleton size="compact" key={index} />
        ))}
      </div>
      {/* in mobile screens this will render */}
      <div className="block md:hidden space-y-10">
        {Array.from({ length: 8 }).map((_, index) => (
          <VideoGridCardSkeleton key={index} />
        ))}
      </div>
    </>
  );
}

export default SuggestionsSection;
