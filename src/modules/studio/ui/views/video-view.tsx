import FormSection from "../sections/form-section";

interface VideoViewProps {
  videoId: string;
}
function VideoView({ videoId }: VideoViewProps) {
  return (
    <div className="px-4 py-2.5 max-w-screen-lg">
      <FormSection videoId={videoId} />
    </div>
  );
}

export default VideoView;
