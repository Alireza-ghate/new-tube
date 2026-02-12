import { Button } from "@/components/ui/button";
import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import { CornerDownRightIcon, Loader2Icon } from "lucide-react";
import CommentItem from "./comment-item";

interface CommentRepliesProps {
  parentId: string;
  videoId: string;
}

function CommentReplies({ parentId, videoId }: CommentRepliesProps) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.comments.getMany.useInfiniteQuery(
      {
        limit: DEFAULT_LIMIT,
        videoId,
        parentId,
      },
      { getNextPageParam: (lastPage) => lastPage.nextCursor },
    );
  return (
    <div className="pl-14">
      <div className="flex flex-col gap-y-4 mt-2">
        {isLoading && (
          <div className="flex items-center justify-center gap-x-2">
            <Loader2Icon className="animate-spin text-muted-foreground size-6" />
            <span>Loading replies...</span>
          </div>
        )}
        {!isLoading &&
          data?.pages
            .flatMap((page) => page.items)
            .map((comment) => (
              <CommentItem key={comment.id} comment={comment} variant="reply" />
            ))}
      </div>
      {hasNextPage && (
        <Button
          disabled={isFetchingNextPage}
          variant="tertiary"
          size="sm"
          onClick={() => fetchNextPage()}
        >
          {isFetchingNextPage ? (
            "Loading replies..."
          ) : (
            <>
              <CornerDownRightIcon />
              <span>Show more replies</span>
            </>
          )}
        </Button>
      )}
    </div>
  );
}

export default CommentReplies;
