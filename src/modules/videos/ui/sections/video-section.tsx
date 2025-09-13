"use client";

import { trpc } from "@/trpc/client";
import VideoPlayer from "../components/video-player";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { cn } from "@/lib/utils";
import VideoBanner from "../components/video-banner";
import VideoTopRow from "../components/video-top-row";
import { useAuth } from "@clerk/nextjs";

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
  return <p>Loading...</p>;
}

export default VideoSection;
