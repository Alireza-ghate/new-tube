"use client";

import ResponsiveModal from "@/components/shared/responsive-modal";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import StudioUploader from "./studio-uploader";
import { useRouter } from "next/navigation";

function StudioUploadModal() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();
  const utils = trpc.useUtils();
  const create = trpc.videos.create.useMutation({
    onSuccess: () => {
      // toast.success("Video successfully created");
      utils.studio.getMany.invalidate(); // invalidate happens in client component
      setIsOpen(true);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function handleSuccess() {
    if (!create.data?.video.id) return;
    setTimeout(() => setIsOpen(false), 1000);
    utils.studio.getMany.invalidate();
    toast.success("Video successfully created");
    // create.reset();
    router.push(`/studio/videos/${create.data.video.id}`);
  }

  return (
    <>
      <Button
        variant={"secondary"}
        onClick={() => create.mutate()}
        disabled={create.isPending}
      >
        {create.isPending ? (
          <Loader2Icon className="animate-spin" />
        ) : (
          <PlusIcon />
        )}
        Create
      </Button>
      <ResponsiveModal
        // open={!!create.data.url}
        // onOpenChange={() => create.reset()}
        open={isOpen}
        onOpenChange={() => setIsOpen(false)}
        title="Upload a video"
      >
        {create.data?.url ? (
          <StudioUploader
            endpoint={create.data?.url}
            onSuccess={handleSuccess}
          />
        ) : (
          <Loader2Icon className="animate-spin" />
        )}
      </ResponsiveModal>
    </>
  );
}

export default StudioUploadModal;
