import { DEFAULT_LIMIT } from "@/constants";
import VideosView from "@/modules/playlists/ui/views/videos-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface SinglePlaylistPageProps {
  params: Promise<{
    playlistId: string;
  }>;
}

async function SinglePlaylistPage({ params }: SinglePlaylistPageProps) {
  const { playlistId } = await params;
  // pre-fetches all videos that are in playlist
  void trpc.playlists.getVideos.prefetchInfinite({
    limit: DEFAULT_LIMIT,
    playlistId,
  });

  void trpc.playlists.getOne.prefetch({ id: playlistId });

  return (
    <HydrateClient>
      <VideosView playlistId={playlistId} />
    </HydrateClient>
  );
}

export default SinglePlaylistPage;
