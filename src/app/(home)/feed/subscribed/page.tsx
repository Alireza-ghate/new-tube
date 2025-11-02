import SubscribedView from "@/modules/home/ui/views/subscribed-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

async function SubscriptionsPage() {
  void trpc.videos.getManySubscribed.prefetchInfinite({ limit: 10 });
  return (
    <HydrateClient>
      <SubscribedView />
    </HydrateClient>
  );
}

export default SubscriptionsPage;
