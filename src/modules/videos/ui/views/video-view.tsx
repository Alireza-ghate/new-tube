import CommentsSection from "../sections/comments-section";
import SuggestionsSection from "../sections/suggestions-section";
import VideoSection from "../sections/video-section";

interface VideoViewProps {
  videoId: string;
}

function VideoView({ videoId }: VideoViewProps) {
  return (
    <div className="flex flex-col max-w-[1700px] pt-2.5 px-4 mb-10 mx-auto">
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <VideoSection videoId={videoId} />
          {/* SuggestionsSection in mobile screeens */}
          <div className="xl:hidden block mt-4">
            <SuggestionsSection videoId={videoId} isManual={true} />
          </div>
          <CommentsSection videoId={videoId} />
        </div>
        {/* SuggestionsSection in large screens */}
        <div className="hidden xl:block w-full xl:w-[380px] 2xl:w-[460px] shrink-1">
          <SuggestionsSection videoId={videoId} isManual={false} />
        </div>
      </div>
    </div>
  );
}

export default VideoView;
