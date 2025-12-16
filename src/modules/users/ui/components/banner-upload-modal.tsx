"use client";

import ResponsiveModal from "@/components/shared/responsive-modal";
import { UploadDropzone } from "@/lib/uploadthing";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";

interface BannerUploadModalProps {
  userId: string; // change banner for this user profile
  open: boolean; //keep track of open state for open/close modal
  onOpenChange: (open: boolean) => void; // state setter fn
}

function BannerUploadModal({
  onOpenChange,
  open,
  userId,
}: BannerUploadModalProps) {
  const utils = trpc.useUtils();

  function onUploadComplete() {
    setTimeout(() => onOpenChange(false), 1000); //close modal
    utils.users.getOne.invalidate({ id: userId }); //invalidate the user page
    toast.success("Banner uploaded successfully");
  }

  return (
    <ResponsiveModal
      title="Upload a banner"
      open={open}
      onOpenChange={onOpenChange}
    >
      <UploadDropzone
        endpoint="bannerUploader"
        onClientUploadComplete={onUploadComplete}
      />
    </ResponsiveModal>
  );
}

export default BannerUploadModal;
