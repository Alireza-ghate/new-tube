// @ (alias) refers to the src folder

import HomeView from "@/modules/home/ui/views/home-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

// anything this component returns, will be children prop in co-located layout.tsx
// when we try to build our project , nextJs will consider every single page that has this pre-fetch data strutcure as STATIC page
// for make it dynamic we use (export const dynamic = force-dynamic;)
interface HomePageProps {
  searchParams: Promise<{
    categoryId?: string;
  }>;
}
async function HomePage({ searchParams }: HomePageProps) {
  const { categoryId } = await searchParams;
  void trpc.categories.getMany.prefetch(); // prefetch data and save it into data cache in the server side, then client component will use this pre-fetched data
  return (
    // where ever in any single component we pre-fetch, we use HydrateClient
    <HydrateClient>
      <HomeView categoryId={categoryId} />
    </HydrateClient>
  );
}

export default HomePage;
