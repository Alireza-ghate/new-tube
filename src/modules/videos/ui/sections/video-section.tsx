"use client";

import { trpc } from "@/trpc/client";
import VideoPlayer from "../components/video-player";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { cn } from "@/lib/utils";
import VideoBanner from "../components/video-banner";
import VideoTopRow from "../components/video-top-row";

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
  const [video] = trpc.videos.getOne.useSuspenseQuery({ id: videoId });
  return (
    <>
      <div
        className={cn(
          "aspect-video relative bg-black rounded-xl overflow-hidden",
          video.muxStatus !== "ready" && "rounded-b-none"
        )}
      >
        <VideoPlayer
          onPlay={() => {}}
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
