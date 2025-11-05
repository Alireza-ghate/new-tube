import LikedVideosSection from "../sections/liked-videos-section";

function LikedView() {
  return (
    <div className="max-w-screen-md mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <div>
        <h1 className="text-2xl font-bold">Liked videos</h1>
        <p className="text-muted-foreground text-xs">Videos you have liked</p>
      </div>

      <LikedVideosSection />
    </div>
  );
}

export default LikedView;
