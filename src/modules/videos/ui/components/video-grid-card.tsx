import Link from "next/link";
import { VideoGetManyOutput } from "../../types";
import VideoThumbnail from "./video-thumbnail";
import VideoInfo from "./video-info";

interface VideoGridCardProps {
  data: VideoGetManyOutput["items"][number];
  onRemove?: () => void;
}

function VideoGridCard({ onRemove, data }: VideoGridCardProps) {
  return (
    <div className="flex flex-col gap-2 w-full group">
      <Link href={`/videos/${data.id}`}>
        <VideoThumbnail
          imageUrl={data.thumbnailUrl}
          duration={data.duration}
          previewUrl={data.previewUrl}
          title={data.title}
        />
      </Link>

      <VideoInfo data={data} onRemove={onRemove} />
    </div>
  );
}

export default VideoGridCard;
