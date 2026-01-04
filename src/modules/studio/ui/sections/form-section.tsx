"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { videoUpdateSchema } from "@/db/schema";
import { snakeCaseToTitle } from "@/lib/utils";
import { THUMBNAIL_FALLBACK } from "@/modules/videos/constants";
import VideoPlayer from "@/modules/videos/ui/components/video-player";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CopyCheckIcon,
  CopyIcon,
  Globe2Icon,
  ImagePlusIcon,
  LockIcon,
  MoreVerticalIcon,
  RotateCcwIcon,
  TrashIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import ThumbnailUploadModal from "../components/thumbnail-upload-modal";
import { APP_URL } from "@/constants";

interface FormSectionProps {
  videoId: string;
}
function FormSectionSuspense({ videoId }: FormSectionProps) {
  // instead of passing videoId as props, we could use useParams() or Use() directly in client component to get params from url
  // whenever we use useSuspenseQury() to read data from data cache for multiple data, suspense loader will waits for all data to be ready
  // if video is not ready but categires is already ready suspense loader will still show loading state
  const router = useRouter();
  const [thumbnailModalOpen, setThumbnailModalOpen] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const utils = trpc.useUtils();
  const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });
  const [categories] = trpc.categories.getMany.useSuspenseQuery();
  const update = trpc.videos.update.useMutation({
    onSuccess: () => {
      toast.success("Video successfully updated");
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ id: videoId }); // also invalidate single video page
    },
    onError: () => {
      // toast.error(error.message);
      toast.error("Something went wrong: failed to update video");
    },
  });

  const form = useForm<z.infer<typeof videoUpdateSchema>>({
    resolver: zodResolver(videoUpdateSchema),
    defaultValues: video,
  });

  const remove = trpc.videos.remove.useMutation({
    onSuccess: () => {
      toast.success("Video successfully deleted");
      router.push("/studio");
      utils.studio.getMany.invalidate();
    },
    onError: () => {
      toast.error("Something went wrong: failed to delete video");
    },
  });

  const restoreThumbnail = trpc.videos.restoreThumbnail.useMutation({
    onSuccess: () => {
      toast.success("Thumbnail successfully restored");
      utils.studio.getOne.invalidate({ id: videoId });
      utils.studio.getMany.invalidate();
    },
    onError: () => {
      toast.error("Something went wrong: failed to restore thumbnail");
    },
  });

  //onSubmit event handler fn only executes when validation is pass(all inputs correctly filled)
  // calling onSumbit() acyncrounously makes formState availbale which contains isSubmitting and other states form.formState
  // BUT calling onSubmit() synchronously, formState is not available instead we use update.isPending
  function onSubmit(data: z.infer<typeof videoUpdateSchema>) {
    // data is UPDATED version of video{} which is gonna send to server to update old video{}
    // this data must be send as arguemnet in update procedure
    update.mutate(data);
  }
  // if form validation fails, onError event handler fn executes
  // function onError(error: Error) {
  //   console.log(error);
  // }

  async function handleCopy() {
    await navigator.clipboard.writeText(fullUrl); // copy fullUrl to clipboard
    setIsCopied(true);
    toast.success("Link copied");
    setTimeout(() => setIsCopied(false), 2000);
  }

  const fullUrl = `${APP_URL}/videos/${videoId}`;

  return (
    <>
      <ThumbnailUploadModal
        videoId={videoId}
        open={thumbnailModalOpen}
        onOpenChange={setThumbnailModalOpen}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Video details</h1>
              <p className="text-xs text-muted-foreground">
                Manage your video details
              </p>
            </div>
            <div className="flex gap-x-2 items-center">
              <Button
                type="submit"
                disabled={update.isPending || !form.formState.isDirty} // disable button if user didnt change anything in form
              >
                Save
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVerticalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => remove.mutate({ id: videoId })}
                  >
                    <TrashIcon className="size-4 mr-2 text-red-700" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* form ui */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* column 1 */}
            <div className="space-y-8 lg:col-span-3">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Add a title to your video"
                        {...field}
                      />
                    </FormControl>
                    {/* for display error messages */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add a description to your video"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        rows={10}
                        className="resize-none pr-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* ADDTO: UPLOAD THUMBNAIL */}
              <FormField
                name="thumbnailUrl"
                control={form.control}
                render={() => (
                  <FormItem>
                    <FormLabel>Thumbnail</FormLabel>
                    <FormControl>
                      <div className="p-0.5 border border-dashed border-neutral-400 relative h-[84px] w-[153px] group">
                        <Image
                          src={video.thumbnailUrl || THUMBNAIL_FALLBACK}
                          fill
                          alt="thumbnail"
                          className="object-cover"
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              size="icon"
                              className="bg-black/50 hover:bg-black/50 absolute top-1 right-1 rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-300 size-7"
                            >
                              <MoreVerticalIcon className="text-white" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" side="right">
                            <DropdownMenuItem
                              onClick={() => setThumbnailModalOpen(true)}
                            >
                              <ImagePlusIcon className="size-4 mr-1" />
                              Change
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem>
                              <SparklesIcon className="size-4 mr-1" />
                              AI-generated
                            </DropdownMenuItem> */}
                            <DropdownMenuItem
                              onClick={() =>
                                restoreThumbnail.mutate({ id: videoId })
                              }
                            >
                              <RotateCcwIcon className="size-4 mr-1" />
                              Restore
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* column 2 */}
            <div className="lg:col-span-2 flex flex-col gap-y-8">
              {/* video player */}
              <div className="flex flex-col gap-y-4 overflow-hidden h-fit bg-[#f9f9f9] rounded-xl">
                <div className="aspect-video overflow-hidden relative">
                  <VideoPlayer
                    playbackId={video.muxPlaybackId}
                    thumbnailUrl={video.thumbnailUrl}
                  />
                </div>
                <div className="p-4 flex flex-col gap-y-6">
                  <div className="flex items-center gap-x-2 justify-between">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-muted-foreground text-xs">
                        Video link
                      </p>
                      <div className="flex items-center gap-x-2">
                        <Link prefetch href={`/videos/${video.id}`}>
                          <p className="text-sm text-blue-500 line-clamp-1">
                            {fullUrl}
                          </p>
                        </Link>
                        <Button
                          type="button"
                          variant={"ghost"}
                          size={"icon"}
                          className="shrink-0"
                          onClick={handleCopy}
                          disabled={isCopied}
                        >
                          {isCopied ? (
                            <CopyCheckIcon className="size-4" />
                          ) : (
                            <CopyIcon className="size-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-muted-foreground text-xs">
                        Video status
                      </p>
                      <p className="text-sm">
                        {snakeCaseToTitle(video.muxStatus || "preparing")}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-muted-foreground text-xs">
                        Subtitles status
                      </p>
                      <p className="text-sm">
                        {/* whenever video has no audio and subtitles muxTrackStatus will be null */}
                        {snakeCaseToTitle(
                          video.muxTrackStatus || "no_subtitles"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibility</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value as "private" | "public"} // default value is private
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="private">
                          <div className="flex items-center">
                            <LockIcon className="size-4 mr-2" />
                            Private
                          </div>
                        </SelectItem>
                        <SelectItem value="public">
                          <div className="flex items-center">
                            <Globe2Icon className="size-4 mr-2" />
                            Public
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}

function FormSection({ videoId }: FormSectionProps) {
  return (
    <Suspense fallback={<FormSectionSkeleton />}>
      <ErrorBoundary fallback={<p>error...</p>}>
        <FormSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
}

function FormSectionSkeleton() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6 mt-2">
        <div className="space-y-2">
          <Skeleton className="h-5 w-[153px]" />
          <Skeleton className="h-3 w-[153px]" />
        </div>
        <div className="flex gap-x-2 items-center">
          <Skeleton className="h-7 w-10" />
          <Skeleton className="size-7" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* column 1 */}
        <div className="space-y-8 lg:col-span-3">
          <div className="space-y-3">
            <Skeleton className="h-5 w-[70px]" />
            <Skeleton className="h-8 w-full" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-5 w-[70px]" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-5 w-[70px]" />
            <Skeleton className="h-[84px] w-[153px]" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-5 w-[70px]" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>

        {/* column 2 */}
        <div className="lg:col-span-2 flex flex-col gap-y-8">
          <div className="flex flex-col gap-y-4 overflow-hidden h-fit bg-[#f9f9f9] rounded-xl">
            <div className="aspect-video overflow-hidden relative">
              <Skeleton className="aspect-video" />
            </div>
            <div className="p-4 flex flex-col gap-y-6">
              <div className="space-y-3">
                <Skeleton className="h-4 w-[70px]" />
                <Skeleton className="h-6 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[70px]" />
                <Skeleton className="h-4 w-[100px]" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[70px]" />
                <Skeleton className="h-4 w-[100px]" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Skeleton className="h-4 w-[70px]" />
            <Skeleton className="h-6 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormSection;
