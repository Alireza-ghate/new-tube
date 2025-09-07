import MuxPlayer from "@mux/mux-player-react";

interface VideoPlayerProps {
  playbackId?: string | null | undefined;
  thumbnailUrl?: string | null | undefined;
  autoPlay?: boolean;
  onPlay?: () => void; // we use it to count how many users viewd this video
}

function VideoPlayer({
  autoPlay,
  onPlay,
  playbackId,
  thumbnailUrl,
}: VideoPlayerProps) {
  // if (!playbackId) return null;

  return (
    <MuxPlayer
      className="w-full h-full object-contain"
      playbackId={playbackId || ""} //whenever we upload a video we have playbackId
      autoPlay={autoPlay}
      onPlay={onPlay}
      poster={thumbnailUrl || "/placeholder.svg"} //if there is no video uploaded by user, there is also no thumbnailUrl
      playerInitTime={0} // helps with hydration
      thumbnailTime={0}
      accentColor="#FF2056"
    />
  );
}

export default VideoPlayer;
