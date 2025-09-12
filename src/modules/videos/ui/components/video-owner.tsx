import Link from "next/link";
import { VideoGetOneOutput } from "../../types";
import UserAvatar from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import SubscriptionButton from "@/modules/subscriptions/ui/components/subscription-button";
import UserInfo from "@/modules/users/ui/components/user-info";

interface VideoOwnerProps {
  user: VideoGetOneOutput["user"];
  videoId: string;
}

function VideoOwner({ user, videoId }: VideoOwnerProps) {
  // check if we are owner of this video or not
  // if we are the owner, show edit btn otherwise show subscribe btn
  const { userId } = useAuth();

  return (
    <div className="flex items-center justify-between sm:items-start sm:justify-start gap-3 min-w-0">
      <Link href={`/users/${user.id}`}>
        <div className="flex items-center gap-3 min-w-0">
          <UserAvatar imageUrl={user.imageUrl} name={user.name} size="lg" />
          <div className="flex flex-col gap-y-1 min-w-0">
            <UserInfo name={user.name} size="lg" />
            <span className="text-sm text-muted-foreground line-clamp-1">
              {0} Subscribers
            </span>
          </div>
        </div>
      </Link>
      {user.clerkId === userId ? (
        <Button variant="secondary" className="rounded-full" size="sm" asChild>
          <Link href={`/studio/videos/${videoId}`}>Edit video</Link>
        </Button>
      ) : (
        <SubscriptionButton
          onClick={() => {}}
          isSubscribed={false}
          disabled={false}
          className="flex-none"
        />
      )}
    </div>
  );
}

export default VideoOwner;
