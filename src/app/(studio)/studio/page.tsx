import { DEFAULT_LIMIT } from "@/constants";
import StudioView from "@/modules/studio/ui/views/studio-view";
import { HydrateClient, trpc } from "@/trpc/server";

async function StudioPage() {
  // if we use prefetchInfinite() in a server component, we have to use useSuspenseInfiniteQuery() in claient component
  void trpc.studio.getMany.prefetchInfinite({ limit: DEFAULT_LIMIT });
  return (
    <HydrateClient>
      <StudioView />
    </HydrateClient>
  );
}

export default StudioPage;
