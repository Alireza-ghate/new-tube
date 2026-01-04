import UserAvatar from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trpc } from "@/trpc/client";
import { formatDistanceToNow } from "date-fns";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MessageSquareIcon,
  MoreVerticalIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { CommentsGetManyOutput } from "../../types";
import CommentForm from "./comment-form";
import { useAuth, useClerk } from "@clerk/nextjs";
import CommentReactions from "./comment-reactions";
import CommentReplies from "./comment-replies";

interface CommentItemProps {
  comment: CommentsGetManyOutput["items"][number];
  variant?: "reply" | "comment";
}

function CommentItem({ comment, variant = "comment" }: CommentItemProps) {
  const [isReplyOpen, setIsReplyOpen] = useState<boolean>(false);
  const [isRepliesOpen, setIsRepliesOpen] = useState<boolean>(false);
  const { userId } = useAuth();
  const clerk = useClerk();
  const utils = trpc.useUtils();
  const remove = trpc.comments.remove.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
      toast.success("Comment deleted");
    },
    onError: (error) => {
      toast.error("Something went wrong: failed to delete comment");
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });

  function handleDelete() {
    remove.mutate({ commentId: comment.id });
  }
  console.log("userId: ", userId, comment.user.clerkId);

  return (
    <div>
      <div className="flex gap-4">
        <Link
          prefetch
          className="flex flex-col items-center gap-y-2"
          href={`/users/${comment.userId}`}
        >
          <UserAvatar
            size={variant === "comment" ? "lg" : "sm"}
            name={comment.user.name}
            imageUrl={comment.user.imageUrl}
          />
          <span className="text-xs text-muted-foreground">
            {comment.user.id === comment.userId && "Author"}
          </span>
        </Link>
        <div className="flex-1 min-w-0">
          <Link
            prefetch
            className="hover:underline w-fit inline-block"
            href={`/users/${comment.userId}`}
          >
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-medium text-sm pb-0.5">
                {comment.user.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
              </span>
            </div>
          </Link>
          <p className="text-sm ">{comment.value}</p>

          <div className="flex items-center gap-2 mt-1">
            <CommentReactions comment={comment} />
            {/* only main comment have reply btn */}
            {variant === "comment" && (
              <Button
                onClick={() => setIsReplyOpen(true)}
                size="sm"
                className="h-8"
                variant="ghost"
              >
                Reply
              </Button>
            )}
          </div>
        </div>
        {/* delete btn */}
        {/* only deletes comments that logged in user created */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {variant === "comment" && (
              <DropdownMenuItem onClick={() => setIsReplyOpen(true)}>
                <MessageSquareIcon className="size-4" />
                Reply
              </DropdownMenuItem>
            )}
            {comment.user.clerkId === userId && (
              <DropdownMenuItem onClick={handleDelete}>
                <Trash2Icon className="size-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isReplyOpen && variant === "comment" && (
        <div className="mt-4 pl-14">
          <CommentForm
            parentId={comment.id}
            onCancel={() => setIsReplyOpen(false)}
            variant="reply"
            videoId={comment.videoId}
            onSuccess={() => {
              setIsReplyOpen(false);
              setIsRepliesOpen(true);
            }}
          />
        </div>
      )}
      {comment.replyCount > 0 && variant === "comment" && (
        <div className="pl-14">
          <Button
            onClick={() => setIsRepliesOpen((current) => !current)}
            size="sm"
            variant="tertiary"
          >
            {isRepliesOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            {comment.replyCount} replies
          </Button>
        </div>
      )}

      {isRepliesOpen && comment.replyCount > 0 && variant === "comment" && (
        <CommentReplies parentId={comment.id} videoId={comment.videoId} />
      )}
    </div>
  );
}

export default CommentItem;
