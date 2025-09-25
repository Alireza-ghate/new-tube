import UserAvatar from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { commentInsertSchema } from "@/db/schema";
import { trpc } from "@/trpc/client";
import { useClerk, useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface CommentFormProps {
  videoId: string;
  onSuccess?: () => void;
}

function CommentForm({ videoId, onSuccess }: CommentFormProps) {
  const { user, isLoaded } = useUser();
  const clerk = useClerk();
  const utils = trpc.useUtils();

  const create = trpc.comments.create.useMutation({
    onSuccess: () => {
      toast.success("Comment added");
      utils.comments.getMany.invalidate({ videoId });
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        toast.error("First login to your account in order to add comment");
        clerk.openSignIn();
      }
    },
  });

  const form = useForm<z.infer<typeof commentInsertSchema>>({
    resolver: zodResolver(commentInsertSchema.omit({ userId: true })),
    defaultValues: {
      videoId,
      value: "",
    },
  });

  function handleSubmit(values: z.infer<typeof commentInsertSchema>) {
    if (values.value.trim() === "") return; //if user dont write anything in textarea dont do anything
    create.mutate(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex gap-4 group"
      >
        <UserAvatar
          imageUrl={user?.imageUrl || "/user_default_avatar.png"}
          name={user?.username || "user"}
          size="lg"
        />
        <div className="flex-1">
          <FormField
            name="value"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Write a comment..."
                    className="resize-none min-h-0 overflow-hidden bg-transparent"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2 mt-2 justify-end">
            <Button
              disabled={create.isPending || !form.formState.isDirty}
              type="submit"
              size="sm"
            >
              Comment
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default CommentForm;
