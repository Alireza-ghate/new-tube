import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";

interface VideoDescriptionProps {
  description?: string | null;
  compactViews: string;
  expandedViews: string;
  compactDate: string;
  expandedDate: string;
}

function VideoDescription({
  description,
  compactViews,
  expandedViews,
  compactDate,
  expandedDate,
}: VideoDescriptionProps) {
  const [isExpended, setIsExpended] = useState(false);
  return (
    <div
      onClick={() => setIsExpended((current) => !current)}
      className="bg-secondary/50 rounded-xl p-3 cursor-pointer hover:bg-secondary/70 transition"
    >
      <div className="flex gap-2 mb-2 text-sm">
        <span className="font-medium">
          {isExpended ? expandedViews : compactViews} views
        </span>
        <span className="font-medium">
          {isExpended ? expandedDate : compactDate}
        </span>
      </div>
      <div className="relative">
        <p
          className={cn(
            "text-sm whitespace-pre-wrap",
            !isExpended && "line-clamp-2"
          )}
        >
          {description || "No description for this video"}
        </p>
        <div className="flex gap-1 mt-4 font-medium text-sm items-center">
          {isExpended ? (
            <>
              Show less <ChevronUpIcon className="size-4" />
            </>
          ) : (
            <>
              Show more <ChevronDownIcon className="size-4" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoDescription;
