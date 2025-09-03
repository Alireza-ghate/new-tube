"use client";

import InfiniteScroll from "@/components/shared/infinite-scroll";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DEFAULT_LIMIT } from "@/constants";
import VideoThumbnail from "@/modules/videos/ui/components/video-thumbnail";
import { trpc } from "@/trpc/client";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

function VideosSectionSuspense() {
  // useSuspenseInfiniteQuery() expect 2 arguments 1: is basic input argument defined in input(), 2: getNextPageParams
  const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  // if (videos.pages.flatMap((page) => page.items).length === 0)
  //   return (
  //     <div className="text-center flex flex-col gap-y-4 items-center">
  //       <p>There is no video. Upload a video to get started</p>
  //       <StudioUploadModal />
  //     </div>
  //   );

  return (
    <div>
      <div className="border-y">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6 w-[510px]">Video</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Comments</TableHead>
              <TableHead className="text-right pr-6">Likes</TableHead>
            </TableRow>
          </TableHeader>
          {/* loop over our videos data */}
          <TableBody>
            {videos.pages
              .flatMap((page) => page.items)
              .map((video) => (
                <Link
                  href={`/studio/videos/${video.id}`}
                  key={video.id}
                  legacyBehavior
                >
                  <TableRow className="cursor-pointer">
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-36 shrink-0 aspect-video">
                          <VideoThumbnail
                            imageUrl={video.thumbnailUrl}
                            previewUrl={video.previewUrl}
                            title={video.title}
                            duration={video.duration || 0}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>visibility</TableCell>
                    <TableCell>{video.muxStatus}</TableCell>
                    <TableCell>date</TableCell>
                    <TableCell className="text-right">views</TableCell>
                    <TableCell className="text-right">comments</TableCell>
                    <TableCell className="text-right pr-6">likes</TableCell>
                  </TableRow>
                </Link>
              ))}
          </TableBody>
        </Table>
      </div>
      <InfiniteScroll
        // isManual={true} // whenever user clicks on load more btn it will fetches next data based on limit value
        // isManual={false} // intersection observer will automatically fetechs data as long as target el is in user's viewport
        isManual
        isFetchingNextPage={query.isFetchingNextPage}
        hasNextPage={query.hasNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </div>
  );
}

function VideosSection() {
  return (
    <Suspense fallback={<VideosSectionLoader />}>
      <ErrorBoundary fallback={<p>error..</p>}>
        <VideosSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
}

function VideosSectionLoader() {
  return (
    <div className="flex flex-col gap-y-2 items-center">
      <Loader2Icon className="size-10 animate-spin text-gray-300" />
      <p>Loading table content</p>
    </div>
  );
}

export default VideosSection;
