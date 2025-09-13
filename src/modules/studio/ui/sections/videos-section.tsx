"use client";

import InfiniteScroll from "@/components/shared/infinite-scroll";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DEFAULT_LIMIT } from "@/constants";
import { snakeCaseToTitle } from "@/lib/utils";
import VideoThumbnail from "@/modules/videos/ui/components/video-thumbnail";
import { trpc } from "@/trpc/client";
import { format } from "date-fns";
import { Globe2Icon, LockIcon } from "lucide-react";
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
                            duration={video.duration}
                          />
                        </div>
                        <div className="flex flex-col overflow-hidden gap-y-1">
                          {/* line-clamp-1 means if text is too long it will collaps */}
                          <span className="text-sm line-clamp-1">
                            {video.title}
                          </span>
                          <span className="text-xs text-muted-foreground line-clamp-1">
                            {video.description || "No description"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {video.visibility === "private" ? (
                          <LockIcon className="size-4 mr-2" />
                        ) : (
                          <Globe2Icon className="size-4 mr-2" />
                        )}
                        {snakeCaseToTitle(video.visibility)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {snakeCaseToTitle(video.muxStatus || "error")}
                      </div>
                    </TableCell>
                    {/* truncate: if text is too long, cuts it and put (...) // for this to work el must have a width or max-w- */}
                    <TableCell className="text-sm truncate">
                      {format(new Date(video.createdAt), "d MMM yyyy")}
                    </TableCell>
                    <TableCell className="text-right text-sm">views</TableCell>
                    <TableCell className="text-right text-sm">
                      comments
                    </TableCell>
                    <TableCell className="text-right text-sm pr-6">
                      likes
                    </TableCell>
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
    <Suspense fallback={<VideosSectionSkeleton />}>
      <ErrorBoundary fallback={<p>error..</p>}>
        <VideosSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
}

function VideosSectionSkeleton() {
  return (
    <>
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

          <TableBody>
            {Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
              <TableRow key={index} className="hover:bg-transparent">
                <TableCell className="pl-6">
                  <div className="flex items-center gap-x-4">
                    <Skeleton className="w-36 h-20" />
                    <div className="flex flex-col overflow-hidden gap-y-2">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-3 w-[150px]" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-x-2">
                    <Skeleton className="size-5" />
                    <Skeleton className="h-4 w-[70px]" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="w-[50px] h-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-[80px] h-4" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="w-[50px] h-4 ml-auto" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="w-[70px] h-4 ml-auto" />
                </TableCell>
                <TableCell className="text-right pr-6">
                  <Skeleton className="w-[40px] h-4 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export default VideosSection;
