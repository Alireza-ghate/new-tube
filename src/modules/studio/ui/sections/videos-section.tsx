"use client";

import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";

function VideosSection() {
  // useSuspenseInfiniteQuery() expect 2 arguments 1: is basic input argument defined in input(), 2: getNextPageParams
  const [data] = trpc.studio.getMany.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  return <div>{JSON.stringify(data)}</div>;
}

export default VideosSection;
