import InfiniteScroll from "@/components/shared/infinite-scroll";
import ResponsiveModal from "@/components/shared/responsive-modal";
import { Button } from "@/components/ui/button";
import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import { Loader2Icon, SquareCheckIcon, SquareIcon } from "lucide-react";
import { toast } from "sonner";

interface PlaylistAddModalProps {
  videoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void; // setter fn
}

function PlaylistAddModal({
  onOpenChange,
  open,
  videoId,
}: PlaylistAddModalProps) {
  // we used useInfiniteQuery to get data from server in client component there is no need to prefetch this
  // this will immediately fetch data from server NOT WHAT WE WANT
  const utils = trpc.useUtils();
  const {
    data: playlists,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = trpc.playlists.getManyForVideo.useInfiniteQuery(
    { limit: DEFAULT_LIMIT, videoId },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: open && !!videoId, // we want to fetch data only when modal is open and videoId is available, not when modal component is rendered!
    }
  );

  const addVideo = trpc.playlists.addVideo.useMutation({
    onSuccess: (data) => {
      toast.success("Video added to playlist successfully");
      utils.playlists.getMany.invalidate(); //allplaylist page will be invalidated
      utils.playlists.getManyForVideo.invalidate({ videoId });
    },
    onError: () => {
      toast.error("Something went wrong: failed to add video to playlist");
    },
  });

  const removeVideo = trpc.playlists.removeVideo.useMutation({
    onSuccess: (data) => {
      toast.success("Video removed from playlist successfully");
      utils.playlists.getMany.invalidate();
      utils.playlists.getManyForVideo.invalidate({ videoId });
    },
    onError: () => {
      toast.error("Something went wrong: failed to remove video from playlist");
    },
  });

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title="Add to playlist"
    >
      <div className="flex flex-col gap-2">
        {isLoading && (
          <div className="flex justify-center p-4">
            <Loader2Icon className="size-8 text-muted-foreground animate-spin" />
          </div>
        )}
        {!isLoading &&
          playlists?.pages
            .flatMap((page) => page.items)
            .map((playlist) => (
              <Button
                variant="ghost"
                className="justify-start px-2 w-full [&_svg]:size-5"
                key={playlist.id}
                size="lg"
                disabled={removeVideo.isPending || addVideo.isPending}
                onClick={() => {
                  // based on playlist.containsVideo we want to add or remove video from playlist
                  if (playlist.containsVideo) {
                    // selected video already in selected playlist, so we want to remove it
                    removeVideo.mutate({ videoId, playlistId: playlist.id });
                  } else {
                    // selected video not in selected playlist, so we want to add it
                    addVideo.mutate({ videoId, playlistId: playlist.id });
                  }
                }}
              >
                {playlist.containsVideo ? (
                  <SquareCheckIcon className="mr-2 size-4" />
                ) : (
                  <SquareIcon className="mr-2 size-4" />
                )}
                {playlist.name}
              </Button>
            ))}
        {!isLoading && (
          <InfiniteScroll
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            isManual={true}
          />
        )}
      </div>
    </ResponsiveModal>
  );
}

export default PlaylistAddModal;
