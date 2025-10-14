"use client";

import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import VideoRowCard from "../components/video-row-card";
import VideoGridCard from "../components/video-grid-card";
import InfiniteScroll from "@/components/shared/infinite-scroll";

interface SuggestionsSectionProps {
  videoId: string;
  isManual?: boolean;
}

function SuggestionsSection({ videoId, isManual }: SuggestionsSectionProps) {
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

export default SuggestionsSection;
