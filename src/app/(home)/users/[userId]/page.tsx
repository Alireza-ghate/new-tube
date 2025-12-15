import { DEFAULT_LIMIT } from "@/constants";
import Userview from "@/modules/users/ui/views/user-view";
import { HydrateClient, trpc } from "@/trpc/server";

interface UserPageProps {
  params: Promise<{ userId: string }>;
}

async function UserPage({ params }: UserPageProps) {
  const { userId } = await params;
  // pre-fetches single user data based on its userId
  void trpc.users.getOne.prefetch({ id: userId });
  //  fetches only videos uploaded by userId
  void trpc.videos.getMany.prefetchInfinite({ limit: DEFAULT_LIMIT, userId });
  return (
    <HydrateClient>
      <Userview userId={userId} />
    </HydrateClient>
  );
}

export default UserPage;
