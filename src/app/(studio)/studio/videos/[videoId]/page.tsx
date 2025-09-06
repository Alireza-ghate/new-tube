import VideoView from "@/modules/studio/ui/views/video-view";
import { HydrateClient, trpc } from "@/trpc/server";

interface VideoFormPageProps {
  params: Promise<{ videoId: string }>;
}

export const dynamic = "force-dynamic";

async function VideoFormPage({ params }: VideoFormPageProps) {
  // querying in database based on videoId
  // we want to get only one data related to one single video based on its id
  // bcs it is a server component we use prefech() here to prefetch data
  // we pass that id inside url as argument in prefetch() to prefetch data based on that
  const { videoId } = await params;
  void trpc.studio.getOne.prefetch({ id: videoId });
  void trpc.categories.getMany.prefetch();

  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
}

export default VideoFormPage;
