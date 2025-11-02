import { trpc } from "@/trpc/client";
import { useClerk } from "@clerk/nextjs";
import { toast } from "sonner";
interface UseSubscriptionsProps {
  userId: string;
  isSubscribed: boolean;
  fromVideoId?: string;
}

export default function useSubscriptions({
  isSubscribed,
  userId,
  fromVideoId,
}: UseSubscriptionsProps) {
  const clerk = useClerk();
  const utils = trpc.useUtils();

  const subscribe = trpc.subscriptions.create.useMutation({
    onSuccess: () => {
      toast.success("Susbscribed!");
      utils.videos.getManySubscribed.invalidate();
      if (fromVideoId) {
        utils.videos.getOne.invalidate({ id: fromVideoId });
      }
    },
    onError: (error) => {
      toast.error("Something went wrong");
      // if there is no user logged in, whenever guest user clicks on subscribe btn , open up the sign in modal
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });
  const unsubscribe = trpc.subscriptions.remove.useMutation({
    onSuccess: () => {
      toast.success("Unsusbscribed!");
      utils.videos.getManySubscribed.invalidate();
      if (fromVideoId) {
        utils.videos.getOne.invalidate({ id: fromVideoId });
      }
    },
    onError: (error) => {
      toast.error("Something went wrong");
      // if there is no user logged in, whenever guest user clicks on subscribe btn , open up the sign in modal
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });
  const isPending = subscribe.isPending || unsubscribe.isPending;

  function onClick() {
    if (isSubscribed) {
      unsubscribe.mutate({ userId });
    } else {
      subscribe.mutate({ userId });
    }
  }

  return { isPending, onClick };
}
