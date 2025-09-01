"use client";

import ResponsiveModal from "@/components/shared/responsive-modal";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import StudioUploader from "./studio-uploader";

function StudioUploadModal() {
  const [open, setIsOpen] = useState<boolean>(false);
  const utils = trpc.useUtils();
  const create = trpc.videos.create.useMutation({
    onSuccess: () => {
      toast.success("Video successfully created");
      utils.studio.getMany.invalidate(); // invalidate happens in client component
      setIsOpen(true);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

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
        open={open}
        onOpenChange={() => setIsOpen(false)}
        title="Upload a video"
      >
        {create.data?.url ? (
          <StudioUploader
            endpoint={create.data?.url}
            onSuccess={() => setIsOpen(false)}
          />
        ) : (
          <Loader2Icon className="animate-spin" />
        )}
      </ResponsiveModal>
    </>
  );
}

export default StudioUploadModal;
