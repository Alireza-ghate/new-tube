import UserAvatar from "@/components/shared/user-avatar";
import { UserGetOneOutput } from "../../types";
import { useAuth, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SubscriptionButton from "@/modules/subscriptions/ui/components/subscription-button";
import useSubscriptions from "@/modules/subscriptions/hooks/use-subscriptions";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface UserPageInfoProps {
  user: UserGetOneOutput;
}

export function UserPageInfoSkeleton() {
  return (
    <div className="py-6">
      {/* mobile layout */}
      <div className="flex flex-col md:hidden">
        <div className="flex items-center gap-3">
          <Skeleton className="h-[60px] w-[60px] rounded-full" />
          <div className="flex-1 min-w-0">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48 mt-1" />
          </div>
        </div>
        <Skeleton className="h-10 w-full mt-3 rounded-full" />
      </div>
      {/* desktop layout */}
      <div className="hidden md:flex items-center gap-4">
        <Skeleton className="h-[160px] w-[160px] rounded-full" />
        <div className="flex-1 min-w-0">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-48 mt-4" />
          <Skeleton className="h-10 w-32 mt-3 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function UserPageInfo({ user }: UserPageInfoProps) {
  const clerk = useClerk();
  // for checking whether we are owner of this acc or not
  const { userId, isLoaded } = useAuth();
  const { isPending, onClick } = useSubscriptions({
    isSubscribed: user.viewerSubscribed,
    userId: user.id,
  });
  return (
    <div className="py-6">
      {/* mobile layout */}
      <div className="flex flex-col md:hidden">
        <div className="flex items-center gap-3">
          <UserAvatar
            name={user.name}
            imageUrl={user.imageUrl}
            size="lg"
            className="h-[60px] w-[60px]"
            onClick={() => {
              // if we are owner of this acc, open user profile
              if (user.clerkId === userId) clerk.openUserProfile();
            }}
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold">{user.name}</h1>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <span>{user.subscriberCount} subcribers</span>
              <span>&bull;</span>
              <span>{user.videoCount} videos</span>
            </div>
          </div>
        </div>

        {user.clerkId === userId ? (
          <Button
            asChild
            variant="secondary"
            className="w-full mt-3 rounded-full"
          >
            <Link prefetch href="/studio">
              Go to studio
            </Link>
          </Button>
        ) : (
          <SubscriptionButton
            className="mt-3 w-full rounded-full"
            disabled={isPending || !isLoaded}
            isSubscribed={user.viewerSubscribed}
            onClick={onClick}
            size="lg"
          />
        )}
      </div>
      {/* desktop layout */}
      <div className="hidden md:flex items-center gap-4">
        <UserAvatar
          name={user.name}
          imageUrl={user.imageUrl}
          size="xl"
          className={cn(
            userId === user.clerkId &&
              "cursor-pointer hover:opacity-80 transition-opacity duration-300"
          )}
          onClick={() => {
            // if we are owner of this acc, open user profile
            if (user.clerkId === userId) clerk.openUserProfile();
          }}
        />

        <div className="flex-1 min-w-0">
          <h1 className="text-4xl font-bold">{user.name}</h1>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-3">
            <span>{user.subscriberCount} subcribers</span>
            <span>&bull;</span>
            <span>{user.videoCount} videos</span>
          </div>

          {user.clerkId === userId ? (
            <Button asChild variant="secondary" className="mt-3 rounded-full">
              <Link prefetch href="/studio">
                Go to studio
              </Link>
            </Button>
          ) : (
            <SubscriptionButton
              className="mt-3 rounded-full"
              disabled={isPending || !isLoaded}
              isSubscribed={user.viewerSubscribed}
              onClick={onClick}
              size="lg"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default UserPageInfo;
