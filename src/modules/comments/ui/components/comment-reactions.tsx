import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { CommentsGetManyOutput } from "../../types";
import { trpc } from "@/trpc/client";
import { useClerk } from "@clerk/nextjs";
import { toast } from "sonner";

interface CommentReactionsProps {
  comment: CommentsGetManyOutput["items"][number];
}

function CommentReactions({ comment }: CommentReactionsProps) {
  console.log(comment.viewerReaction);
  const utils = trpc.useUtils();
  const clerk = useClerk();
  const like = trpc.commentReactions.like.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
        toast.error("for like/dislike first login");
      }
    },
  });
  const dislike = trpc.commentReactions.dislike.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
        toast.error("for like/dislike first login");
      }
    },
  });
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          disabled={like.isPending || dislike.isPending}
          onClick={() => like.mutate({ commentId: comment.id })}
        >
          <ThumbsUpIcon
            className={cn(comment.viewerReaction === "like" && "fill-black")}
          />
        </Button>
        <span className="text-xs text-muted-foreground mx-0.5">
          {comment.likeCount}
        </span>

        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          disabled={dislike.isPending || like.isPending}
          onClick={() => dislike.mutate({ commentId: comment.id })}
        >
          <ThumbsDownIcon
            className={cn(comment.viewerReaction === "dislike" && "fill-black")}
          />
        </Button>
        <span className="text-xs text-muted-foreground mx-0.5">
          {comment.dislikeCount}
        </span>
      </div>
    </div>
  );
}

export default CommentReactions;
