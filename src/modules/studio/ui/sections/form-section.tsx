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
import { Textarea } from "@/components/ui/textarea";
import { videoUpdateSchema } from "@/db/schema";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoreVerticalIcon, TrashIcon } from "lucide-react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface FormSectionProps {
  videoId: string;
}
function FormSectionSuspense({ videoId }: FormSectionProps) {
  // instead of passing videoId as props, we could use useParams() or Use() directly in client component to get params from url
  // whenever we use useSuspenseQury() to read data from data cache for multiple data, suspense loader will waits for all data to be ready
  // if video is not ready but categires is already ready suspense loader will still show loading state
  const utils = trpc.useUtils();
  const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });
  const [categories] = trpc.categories.getMany.useSuspenseQuery();
  const update = trpc.videos.update.useMutation({
    onSuccess: () => {
      toast.success("Video successfully updated");
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ id: videoId }); // also invalidate single video
    },
    onError: () => {
      // toast.error(error.message);
      toast.error("Something went wrong");
    },
  });

  const form = useForm<z.infer<typeof videoUpdateSchema>>({
    resolver: zodResolver(videoUpdateSchema),
    defaultValues: video,
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

  return (
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
            <Button type="submit" disabled={update.isPending}>
              Save
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVerticalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
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
                    <Input placeholder="Add a title to your video" {...field} />
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
          <div className="lg:col-span-2 bg-amber-300">colomn 2</div>
        </div>
      </form>
    </Form>
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
  return <p>loading...</p>;
}

export default FormSection;
