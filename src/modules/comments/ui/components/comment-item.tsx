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
import { MessageSquareIcon, MoreVerticalIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { CommentsGetManyOutput } from "../../types";
import CommentForm from "./comment-form";
import { useAuth, useClerk } from "@clerk/nextjs";

interface CommentItemProps {
  comment: CommentsGetManyOutput["items"][number];
}

function CommentItem({ comment }: CommentItemProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
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

  // function handleReply() {
  //   // if (!isSignedIn) return clerk.openSignIn();
  //   // toast.error("First login to your account in order to reply");
  //   // setIsOpen((isOpen) => !isOpen);
  // }

  return (
    <div>
      <div className="flex gap-4">
        <Link href={`/users/${comment.userId}`}>
          <UserAvatar
            size="lg"
            name={comment.user.name}
            imageUrl={comment.user.imageUrl}
          />
          <span className="text-xs text-muted-foreground">
            {comment.user.id === comment.userId && "Author"}
          </span>
        </Link>
        <div className="flex-1 min-w-0">
          <Link
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
          {/* todo: reactins */}

          {isOpen ? <CommentForm videoId={comment.videoId} /> : null}
        </div>
        {/* delete btn */}
        {/* only deletes comments that logged in user created */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => {}}>
              <MessageSquareIcon className="size-4" />
              Reply
            </DropdownMenuItem>
            {comment.user.clerkId === userId && (
              <DropdownMenuItem onClick={handleDelete}>
                <Trash2Icon className="size-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default CommentItem;
