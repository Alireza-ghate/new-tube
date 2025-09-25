"use client";

import InfiniteScroll from "@/components/shared/infinite-scroll";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DEFAULT_LIMIT } from "@/constants";
import CommentForm from "@/modules/comments/ui/components/comment-form";
import CommentItem from "@/modules/comments/ui/components/comment-item";
import { trpc } from "@/trpc/client";
import { SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { Loader2Icon } from "lucide-react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface CommentsSectionProps {
  videoId: string;
}

function CommentsSection({ videoId }: CommentsSectionProps) {
  return (
    <Suspense fallback={<CommentSectionSkeleton />}>
      <ErrorBoundary fallback={<p>error...</p>}>
        <CommentsSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
}

function CommentsSectionSuspense({ videoId }: CommentsSectionProps) {
  // check if there is no user logged in, dont render comment-form.tsx
  const { user, isLoaded, isSignedIn } = useUser();
  const [comments, query] = trpc.comments.getMany.useSuspenseInfiniteQuery(
    {
      videoId,
      limit: DEFAULT_LIMIT,
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  const loginBlock = (
    <div className="flex flex-col items-center gap-y-2">
      <p className="text-sm font-medium italic">
        in order to add comment, please login
      </p>
      <SignedOut>
        <SignInButton fallbackRedirectUrl={`/videos/${videoId}`} mode="modal">
          <Button
            variant="ghost"
            className="px-4 py-2 font-medium text-sm text-blue-600 hover:text-blue-500 border-blue-500/20 rounded-full shadow-none"
          >
            Sign in
          </Button>
        </SignInButton>
      </SignedOut>
    </div>
  );

  // comment-form skeleton
  if (!isLoaded)
    return (
      <div className="flex flex-col gap-3 mt-6">
        <Skeleton className="h-6 w-[150px]" />

        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="h-9 w-full rounded-xl" />
        </div>
      </div>
    );

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-6">
        <h1 className="text-xl font-bold">
          {comments.pages[0].totalCount} comments
        </h1>
        {user && isLoaded && isSignedIn ? (
          <CommentForm videoId={videoId} onSuccess={() => {}} />
        ) : (
          loginBlock
        )}

        <div className="flex flex-col gap-y-4 mt-2">
          {comments.pages
            .flatMap((page) => page.items)
            .map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          <InfiniteScroll
            fetchNextPage={query.fetchNextPage}
            hasNextPage={query.hasNextPage}
            isFetchingNextPage={query.isFetchingNextPage}
            isManual={true}
          />
        </div>
      </div>
    </div>
  );
}

function CommentSectionSkeleton() {
  return (
    <div className="mt-6 flex justify-center items-center">
      <Loader2Icon className="animate-spin text-muted-foreground size-7" />
    </div>
  );
}

export default CommentsSection;
