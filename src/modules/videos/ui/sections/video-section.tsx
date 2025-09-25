"use client";

import { trpc } from "@/trpc/client";
import VideoPlayer from "../components/video-player";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { cn } from "@/lib/utils";
import VideoBanner from "../components/video-banner";
import VideoTopRow from "../components/video-top-row";
import { useAuth } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";

interface VideoSectionProps {
  videoId: string;
}
function VideoSection({ videoId }: VideoSectionProps) {
  return (
    <Suspense fallback={<VideoSectionSkeleton />}>
      <ErrorBoundary fallback={<p>error...</p>}>
        <VideoSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
}

function VideoSectionSuspense({ videoId }: VideoSectionProps) {
  const { isSignedIn } = useAuth();
  const utils = trpc.useUtils();
  const [video] = trpc.videos.getOne.useSuspenseQuery({ id: videoId });
  const createView = trpc.videoViews.create.useMutation({
    onSuccess: () => utils.videos.getOne.invalidate({ id: videoId }),
  });

  // whenever a user plays the video, we create a videoView{} inside database and number of videoViews will be number of pple who watched the video
  function handlePlay() {
    if (!isSignedIn) return; //if there is no user break the method
    createView.mutate({ videoId });
  }
  return (
    <>
      <div
        className={cn(
          "aspect-video relative bg-black rounded-xl overflow-hidden",
          video.muxStatus !== "ready" && "rounded-b-none"
        )}
      >
        <VideoPlayer
          onPlay={handlePlay}
          playbackId={video.muxPlaybackId}
          thumbnailUrl={video.thumbnailUrl}
        />
      </div>
      <VideoBanner status={video.muxStatus} />
      <VideoTopRow video={video} />
    </>
  );
}

function VideoSectionSkeleton() {
  return (
    <>
      <div className="aspect-video relative rounded-xl overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <Skeleton className="h-6 w-[250px]" />
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          {/* videoowner */}
          <div className="flex items-center justify-between sm:items-start sm:justify-start gap-3 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex flex-col gap-y-1 min-w-0">
                <Skeleton className="h-3 w-[140px]" />
                <Skeleton className="h-3 w-[100px]" />
              </div>
              <Skeleton className="w-[80px] h-[30px] rounded-full" />
            </div>
          </div>
          {/* VideoReactions */}
          <div className="flex overflow-x-auto sm:min-w-[calc(50%-6px)] sm:justify-end sm:overflow-visible pb-2 -mb-2 sm:pb-0 sm:mb-0 gap-2">
            <Skeleton className="w-[100px] h-[35px] rounded-full" />
            <Skeleton className="size-9 rounded-full" />
          </div>
        </div>
        {/* VideoDescription */}
        <div className="bg-secondary/50 rounded-xl p-3">
          <div className="flex gap-2 mb-2 text-sm">
            <Skeleton className="w-[50px] h-5 rounded-full" />
            <Skeleton className="w-[100px] h-5 rounded-full" />
          </div>
          <div className="flex flex-col gap-y-3">
            <Skeleton className="w-full h-5 rounded-full" />
            <Skeleton className="w-3/5 h-5 rounded-full" />
            <Skeleton className="w-1/2 h-5 rounded-full" />
          </div>
        </div>
      </div>
    </>
  );
}

export default VideoSection;
