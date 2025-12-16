import { cn } from "@/lib/utils";
import { UserGetOneOutput } from "../../types";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Edit2Icon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import BannerUploadModal from "./banner-upload-modal";

interface UserPageBannerProps {
  user: UserGetOneOutput;
}

export function UserPageBannerSkeleton() {
  return (
    <Skeleton className="w-full max-h-[200px] h-[15vh] md:h-[25vh] rounded-xl" />
  );
}

function UserPageBanner({ user }: UserPageBannerProps) {
  // userId === The ID of the current user.
  const { userId } = useAuth();
  const [isBannerUploadModalOpen, setIsBannerUploadModalOpen] = useState(false);
  return (
    <div className="relative group">
      <BannerUploadModal
        onOpenChange={setIsBannerUploadModalOpen}
        open={isBannerUploadModalOpen}
        userId={user.id}
      />
      <div
        className={cn(
          "w-full max-h-[200px] h-[15vh] md:h-[25vh] bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl",
          user.bannerUrl ? "bg-cover bg-center" : "bg-gray-100"
        )}
        style={{
          backgroundImage: user.bannerUrl
            ? `url(${user.bannerUrl})`
            : undefined,
        }}
      >
        {/* the user who currently logged in is the same as the user who is on this page */}
        {user.clerkId === userId && (
          <Button
            onClick={() => setIsBannerUploadModalOpen(true)}
            type="button"
            size="icon"
            className="absolute top-4 right-4 rounded-full bg-black/50 hover:bg-black/50 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <Edit2Icon className="size-4 text-white" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default UserPageBanner;
