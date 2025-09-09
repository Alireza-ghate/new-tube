"use client";

import ResponsiveModal from "@/components/shared/responsive-modal";
import { UploadDropzone } from "@/lib/uploadthing";
import { trpc } from "@/trpc/client";

interface ThumbnailUploadModalProps {
  videoId: string; // change thumbnail for this video
  open: boolean; //keep track of open state for open/close modal
  onOpenChange: (open: boolean) => void;
}

function ThumbnailUploadModal({
  onOpenChange,
  open,
  videoId,
}: ThumbnailUploadModalProps) {
  const utils = trpc.useUtils();

  function onUploadComplete() {
    setTimeout(() => onOpenChange(false), 1000); //close modal
    utils.studio.getOne.invalidate({ id: videoId }); //invalidate the video form page
    utils.studio.getMany.invalidate();
  }

  return (
    <ResponsiveModal
      title="Upload a thumbnail"
      open={open}
      onOpenChange={onOpenChange}
    >
      <UploadDropzone
        endpoint="thumbnailUploader"
        input={{ videoId }}
        onClientUploadComplete={onUploadComplete}
      />
    </ResponsiveModal>
  );
}

export default ThumbnailUploadModal;
