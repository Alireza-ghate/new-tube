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
  parentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  variant?: "reply" | "comment";
}

function CommentForm({
  videoId,
  onSuccess,
  onCancel,
  parentId,
  variant = "comment",
}: CommentFormProps) {
  const { user } = useUser();
  const clerk = useClerk();
  const utils = trpc.useUtils();

  const commentFormSchema = commentInsertSchema.omit({
    userId: true,
  });

  const form = useForm<z.infer<typeof commentFormSchema>>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      videoId,
      value: "",
      parentId,
    },
  });

  const create = trpc.comments.create.useMutation({
    onSuccess: () => {
      toast.success("Comment added");
      utils.comments.getMany.invalidate({ videoId });
      utils.comments.getMany.invalidate({ videoId, parentId });
      form.reset();
      onSuccess?.();
    },

    onError: (error) => {
      toast.error("First login to your account in order to add comment");
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });

  function handleSubmit(values: z.infer<typeof commentFormSchema>) {
    if (values.value.trim() === "") return; //if user dosnt write anything in textarea dont do anything
    create.mutate(values);
  }

  function handleCancel() {
    form.reset();
    onCancel?.();
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
          size={variant === "reply" ? "sm" : "lg"}
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
                    placeholder={
                      variant === "reply"
                        ? "Reply to this comment..."
                        : "Write a comment..."
                    }
                    className="resize-none min-h-0 overflow-hidden bg-transparent"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2 mt-2 justify-end">
            {onCancel && (
              <Button onClick={handleCancel} variant="ghost" type="button">
                Cancel
              </Button>
            )}
            <Button
              disabled={create.isPending || !form.formState.isDirty}
              type="submit"
              size="sm"
            >
              {variant === "reply" ? "Reply" : "Comment"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default CommentForm;
