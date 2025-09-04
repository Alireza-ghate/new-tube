import { formatDuration } from "@/lib/utils";
import Image from "next/image";

interface VideoThumbnailProps {
  imageUrl?: string | null;
  previewUrl?: string | null;
  title: string;
  duration: number;
}

function VideoThumbnail({
  imageUrl,
  previewUrl,
  title,
  duration,
}: VideoThumbnailProps) {
  return (
    <div className="relative group">
      {/* thumbnail wrapper: we put static image and gif of video if hover on it remove static image and play gif */}
      <div className="relative w-full overflow-hidden rounded-xl aspect-video">
        <Image
          src={imageUrl ?? "/placeholder.svg"} // if imageUrl is null or undefined returns placeholder image
          fill
          sizes="100%"
          priority
          alt={`thumbnail of ${title}`}
          className="size-full object-cover group-hover:opacity-0"
        />
        <Image
          sizes="100%"
          unoptimized={!!previewUrl}
          src={previewUrl ?? "/placeholder.svg"}
          fill
          alt={`thumbnail of ${title}`}
          className="size-full object-cover opacity-0 group-hover:opacity-100"
        />
      </div>
      {/* video duration box */}
      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 py-0.5 rounded font-medium">
        {formatDuration(duration)}
      </div>
    </div>
  );
}

export default VideoThumbnail;
