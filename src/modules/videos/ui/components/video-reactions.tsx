import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";

function VideoReactions() {
  const videReaction = "liked";
  return (
    <div className="flex items-center flex-none">
      <Button
        variant="secondary"
        className="pr-4 gap-2 rounded-l-full rounded-r-none"
      >
        <ThumbsUpIcon
          className={cn("size-5", videReaction === "liked" && "fill-black")}
        />
        {1}
      </Button>
      <Separator orientation="vertical" className="h-7" />
      <Button
        variant="secondary"
        className="pl-3 rounded-l-none rounded-r-full"
      >
        <ThumbsDownIcon
          className={cn("size-5", videReaction !== "liked" && "fill-black")}
        />
        {2}
      </Button>
    </div>
  );
}

export default VideoReactions;
