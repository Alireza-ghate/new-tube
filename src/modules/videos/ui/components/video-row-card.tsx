import { cva, VariantProps } from "class-variance-authority";
import { VideoGetManyOutput } from "../../types";
import Link from "next/link";
import VideoThumbnail from "./video-thumbnail";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/shared/user-avatar";
import UserInfo from "@/modules/users/ui/components/user-info";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import VideoMenu from "./video-menu";
import { useMemo } from "react";

const videoRowCardVariants = cva("group flex min-w-0", {
  variants: {
    size: {
      default: "gap-4",
      compact: "gap-2",
    },
  },

  defaultVariants: {
    size: "default",
  },
});

const thumbnailVariants = cva("relative flex-none", {
  variants: {
    size: {
      default: "w-[38%]",
      compact: "w-[168px]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface VideoRowCardProps extends VariantProps<typeof videoRowCardVariants> {
  data: VideoGetManyOutput["items"][number];
  onRemove?: () => void;
}

export function VideoRowCardSkeleton() {
  return <div>skeleton</div>;
}

function VideoRowCard({ data, onRemove, size }: VideoRowCardProps) {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat("us", { notation: "compact" }).format(
      data.viewCount
    );
  }, [data.viewCount]);

  const compactLikes = useMemo(() => {
    return Intl.NumberFormat("us", { notation: "compact" }).format(
      data.likeCount
    );
  }, [data.likeCount]);
  return (
    <div className={videoRowCardVariants({ size })}>
      <Link href={`/videos/${data.id}`} className={thumbnailVariants({ size })}>
        <VideoThumbnail
          imageUrl={data.thumbnailUrl}
          duration={data.duration}
          title={data.title}
          previewUrl={data.previewUrl}
        />
      </Link>
      {/* infos */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-x-2">
          <Link className="flex-1 min-w-0" href={`/videos/${data.id}`}>
            <h3
              className={cn(
                "font-medium line-clamp-2",
                size === "compact" ? "text-sm" : "text-base"
              )}
            >
              {data.title}
            </h3>
            {size === "default" && (
              <p className="text-xs text-muted-foreground mt-1">
                {compactViews} views &bull; {compactLikes} likes
              </p>
            )}
            {size === "default" && (
              <>
                <div className="flex items-center my-3">
                  <UserAvatar
                    size="sm"
                    imageUrl={data.user.imageUrl}
                    name={data.user.name}
                  />
                  <UserInfo size="sm" name={data.user.name} className="ml-2" />
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="line-clamp-2 text-xs text-muted-foreground w-fit">
                      {data.description || "No description"}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent
                    className="bg-black/70"
                    side="bottom"
                    align="center"
                  >
                    <p>From the video description</p>
                  </TooltipContent>
                </Tooltip>
              </>
            )}

            {size === "compact" && <UserInfo name={data.user.name} size="sm" />}
            {size === "compact" && (
              <p className="text-xs text-muted-foreground mt-1">
                {compactViews} views &bull; {compactLikes} likes
              </p>
            )}
          </Link>
          <div className="">
            <VideoMenu videoId={data.id} onRemove={onRemove} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoRowCard;
