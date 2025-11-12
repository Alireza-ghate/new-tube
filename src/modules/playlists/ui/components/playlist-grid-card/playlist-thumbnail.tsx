import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { THUMBNAIL_FALLBACK } from "@/modules/videos/constants";
import { ListVideoIcon, PlayIcon } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";

interface PlaylistThumbnailProps {
  imageUrl: string;
  title: string;
  videoCount: number;
  className?: string;
}

export function PlaylistThumbnailSkeleton() {
  return (
    <div className="relative overflow-hidden w-full rounded-xl aspect-video">
      <Skeleton className="size-full" />
    </div>
  );
}

function PlaylistThumbnail({
  imageUrl,
  title,
  videoCount,
  className,
}: PlaylistThumbnailProps) {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat("us", { notation: "compact" }).format(videoCount);
  }, [videoCount]);
  return (
    <div className={cn("relative pt-3 group", className)}>
      {/* stack effect layers */}
      <div className="relative">
        {/* background layers */}
        {/* background layer 1 */}
        <div className="absolute bg-black/20 -top-3 -translate-x-1/2 left-1/2 w-[97%] overflow-hidden rounded-xl aspect-video" />
        {/* background layer 2 */}
        <div className="absolute bg-black/25 -top-1.5 -translate-x-1/2 left-1/2 w-[98.5%] overflow-hidden rounded-xl aspect-video" />
        {/* main image */}
        <div className="relative overflow-hidden w-full rounded-xl aspect-video">
          <Image
            src={imageUrl || THUMBNAIL_FALLBACK}
            alt={title}
            className="w-full h-full object-cover"
            fill
          />
          {/* hover overlay effect */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
            <div className="flex items-center gap-x-2 text-white">
              <PlayIcon className="size-4 fill-white" />
              <span className="font-medium">Play all</span>
            </div>
          </div>
        </div>
      </div>
      {/* videocount indicator */}
      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 py-0.5 rounded font-medium flex items-center gap-x-1 ">
        <ListVideoIcon className="size-4" />
        <span>{compactViews} videos</span>
      </div>
    </div>
  );
}

export default PlaylistThumbnail;
