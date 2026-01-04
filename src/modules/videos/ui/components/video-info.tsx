import { useMemo } from "react";
import { VideoGetManyOutput } from "../../types";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import UserAvatar from "@/components/shared/user-avatar";
import UserInfo from "@/modules/users/ui/components/user-info";
import VideoMenu from "./video-menu";
import { Skeleton } from "@/components/ui/skeleton";

interface VideoInfoProps {
  data: VideoGetManyOutput["items"][number];
  onRemove?: () => void;
}

function VideoInfo({ data, onRemove }: VideoInfoProps) {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat("us", { notation: "compact" }).format(
      data.viewCount
    );
  }, [data.viewCount]);
  const compactDate = useMemo(() => {
    return formatDistanceToNow(data.createdAt, { addSuffix: true });
  }, [data.createdAt]);

  return (
    <div className="flex gap-3">
      <Link prefetch href={`/users/${data.user.id}`}>
        <UserAvatar imageUrl={data.user.imageUrl} name={data.user.name} />
      </Link>
      <div className="min-w-0 flex-1">
        <Link prefetch href={`/videos/${data.id}`}>
          <h3 className="font-medium line-clamp-1 lg:line-clamp-2 text-base break-words">
            {data.title}
          </h3>
        </Link>
        <Link prefetch href={`/users/${data.user.id}`}>
          <UserInfo name={data.user.name} />
        </Link>
        <Link prefetch href={`/videos/${data.id}`}>
          <p className="text-sm text-gray-600 line-clamp-1">
            {compactViews} views &bull; {compactDate}
          </p>
        </Link>
      </div>

      <div className="flex-shrink-0">
        <VideoMenu videoId={data.id} onRemove={onRemove} />
      </div>
    </div>
  );
}

export function VideoInfoSkeleton() {
  return (
    <div className="flex gap-3">
      <Skeleton className="size-10 shrink-0 rounded-full" />

      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="w-[90%] h-5" />
        <Skeleton className="w-[70%] h-5" />
      </div>

      <div className="flex-shrink-0">
        <Skeleton className="size-3 rounded-full" />
      </div>
    </div>
  );
}

export default VideoInfo;
