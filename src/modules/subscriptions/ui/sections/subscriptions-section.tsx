"use client";

import InfiniteScroll from "@/components/shared/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import { UserX } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";
import SubscriptionItem, {
  SubscriptionItemSkeleton,
} from "../components/subscription-item";

function SubscriptionsSectionSuspense() {
  // const isMobile = useIsMobile();
  const utils = trpc.useUtils();
  const [subscriptions, query] =
    trpc.subscriptions.getMany.useSuspenseInfiniteQuery(
      {
        limit: DEFAULT_LIMIT,
      },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    );

  const unsubscribe = trpc.subscriptions.remove.useMutation({
    onSuccess: (data) => {
      toast.success("Unsusbscribed!");
      utils.videos.getManySubscribed.invalidate();
      utils.users.getOne.invalidate({ id: data.creatorId });
      utils.subscriptions.getMany.invalidate();
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  if (!subscriptions.pages.flatMap((page) => page.items).length)
    return (
      <div className="py-3 px-4 h-[70vh] flex flex-col items-center justify-center gap-y-2">
        <UserX className="size-32 text-gray-200" strokeWidth={1.5} />
        <p className="text-muted-foreground">No subscriptions</p>
      </div>
    );
  return (
    <div>
      {/* for showing videos on mobile and desktop we can use isMobile or we can define display: none or flex to show/hide it */}
      <div className="flex flex-col gap-4">
        {subscriptions.pages
          .flatMap((page) => page.items)
          .map((subscription) => (
            <Link
              prefetch
              key={subscription.creatorId}
              href={`/users/${subscription.user.id}`}
            >
              <SubscriptionItem
                name={subscription.user.name}
                imageUrl={subscription.user.imageUrl}
                subscriberCount={subscription.user.subscriberCount}
                onUnsubscribe={() => {
                  unsubscribe.mutate({ userId: subscription.creatorId });
                }}
                disabled={unsubscribe.isPending}
              />
            </Link>
          ))}
      </div>

      <InfiniteScroll
        fetchNextPage={query.fetchNextPage}
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
      />
    </div>
  );
}

function SubscriptionsSectionSkeleton() {
  return (
    <div className="flex flex-col gap-y-4">
      {Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
        <SubscriptionItemSkeleton key={index} />
      ))}
    </div>
  );
}

function SubscriptionsSection() {
  return (
    <Suspense fallback={<SubscriptionsSectionSkeleton />}>
      <ErrorBoundary fallback={<p>error...</p>}>
        <SubscriptionsSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
}

export default SubscriptionsSection;
