import { useMemo } from "react";
import { VideoGetOneOutput } from "../../types";
import VideoDescription from "./video-description";
import VideoMenu from "./video-menu";
import VideoOwner from "./video-owner";
import VideoReactions from "./video-reactions";
import { format, formatDistanceToNow } from "date-fns";

interface VideoTopRowProps {
  video: VideoGetOneOutput; // this is the type of the data returned by the getOne method in the videos router no need to write it manually
}

function VideoTopRow({ video }: VideoTopRowProps) {
  // we use useMemo() to memoize the function evry time we render the component to avoid unnecessary re-calculations
  const compactViews = useMemo(function compactViews() {
    return Intl.NumberFormat("en-US", { notation: "compact" }).format(1500); //1500 is mock data
  }, []);

  const expandedViews = useMemo(function expandedViews() {
    return Intl.NumberFormat("en-US", { notation: "standard" }).format(1500); //1500 is mock data
  }, []);

  const compactDate = useMemo(
    function compactDate() {
      return formatDistanceToNow(video.createdAt, {
        addSuffix: true,
      }); // x days ago
    },
    [video.createdAt]
  );

  const expandedDate = useMemo(
    function expandedDate() {
      return format(video.createdAt, "dd MMM yyyy");
    },
    [video.createdAt]
  );

  return (
    <div className="flex flex-col gap-4 mt-4">
      <h1 className="text-xl font-semibold">{video.title}</h1>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <VideoOwner user={video.user} videoId={video.id} />
        <div className="flex overflow-x-auto sm:min-w-[calc(50%-6px)] sm:justify-end sm:overflow-visible pb-2 -mb-2 sm:pb-0 sm:mb-0 gap-2">
          <VideoReactions />
          <VideoMenu videoId={video.id} variant="secondary" />
        </div>
      </div>
      <VideoDescription
        description={video.description}
        compactViews={compactViews}
        expandedViews={expandedViews}
        compactDate={compactDate}
        expandedDate={expandedDate}
      />
    </div>
  );
}

export default VideoTopRow;
