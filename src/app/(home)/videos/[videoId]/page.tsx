import { DEFAULT_LIMIT } from "@/constants";
import VideoView from "@/modules/videos/ui/views/video-view";
import { HydrateClient, trpc } from "@/trpc/server";

//make this page dynamic bcs in production when we build our project , nextJs will consider every single page that has this pre-fetch data strutcure as STATIC page
export const dynamic = "force-dynamic";

interface VideoPageProps {
  params: Promise<{
    videoId: string;
  }>;
}

async function VideoPage({ params }: VideoPageProps) {
  const { videoId } = await params;
  void trpc.videos.getOne.prefetch({ id: videoId }); //get single video{} based on its videoid
  void trpc.comments.getMany.prefetchInfinite({
    videoId,
    limit: DEFAULT_LIMIT,
  }); //get all relavent comments based on videoId
  void trpc.suggestions.getMany.prefetchInfinite({
    videoId,
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
}

export default VideoPage;
