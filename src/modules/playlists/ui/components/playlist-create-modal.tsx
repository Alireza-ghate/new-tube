import ResponsiveModal from "@/components/shared/responsive-modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface PlaylistCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  name: z.string().min(1),
});
function PlaylistCreateModal({ onOpenChange, open }: PlaylistCreateModalProps) {
  const utils = trpc.useUtils();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const create = trpc.playlists.create.useMutation({
    onSuccess: () => {
      toast.success("Playlist created successfully");
      utils.playlists.getMany.invalidate();
      form.reset(); // reset form
      onOpenChange(false); // close modal
    },
    onError: () => {
      toast.error("Something went wrong: failed to create playlist");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    create.mutate(values); // creates playlist
  }

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={onOpenChange}
      title="Create a playlist"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)} // submit form
          className="flex flex-col gap-4 px-6 md:px-0"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Playlist name:</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="example: My favorite videos" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button disabled={create.isPending} type="submit">
              Create
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  );
}

export default PlaylistCreateModal;
