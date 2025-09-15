import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { useClerk } from "@clerk/nextjs";
import { Code, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { toast } from "sonner";

interface VideoReactionsProps {
  videoId: string;
  likes: number;
  dislikes: number;
  viewerReaction: "like" | "dislike" | null;
}

function VideoReactions({
  dislikes,
  likes,
  viewerReaction,
  videoId,
}: VideoReactionsProps) {
  const utils = trpc.useUtils();
  const clerk = useClerk(); //to check if user logged in to like and dislike video

  const dislike = trpc.videoReactions.dislike.useMutation({
    onSuccess: () => utils.videos.getOne.invalidate({ id: videoId }),
    onError: (error) => {
      toast.error("for like/dislike first login");
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });

  const like = trpc.videoReactions.like.useMutation({
    onSuccess: () => utils.videos.getOne.invalidate({ id: videoId }),
    onError: (error) => {
      toast.error("for like/dislike first login");
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });

  return (
    <div className="flex items-center flex-none">
      <Button
        onClick={() => like.mutate({ videoId })}
        disabled={like.isPending || dislike.isPending}
        variant="secondary"
        className="pr-4 gap-2 rounded-l-full rounded-r-none"
      >
        <ThumbsUpIcon
          className={cn("size-5", viewerReaction === "like" && "fill-black")}
        />
        {likes}
      </Button>
      <Separator orientation="vertical" className="h-7" />
      <Button
        onClick={() => dislike.mutate({ videoId })}
        disabled={like.isPending || dislike.isPending}
        variant="secondary"
        className="pl-3 rounded-l-none rounded-r-full"
      >
        <ThumbsDownIcon
          className={cn("size-5", viewerReaction === "dislike" && "fill-black")}
        />
        {dislikes}
      </Button>
    </div>
  );
}

export default VideoReactions;
