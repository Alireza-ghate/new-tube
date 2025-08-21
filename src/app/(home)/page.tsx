// @ (alias) refers to the src folder

import { HydrateClient, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Client from "./Client";
// anything this component returns, will be children prop in co-located layout.tsx
// export default function HomePage() {
//   return (
//     <div className="text-3xl">
//      home page
//     </div>
//   );
// }

// how we fetch data in a server component using tRPC(server version)
/*
async function HomePage() {
  const data = await trpc.hello({ text: "alireza" });
  return <div>{data.greeting}</div>;
}

export default HomePage;
*/
// how we PRE-fetch data in a server component using tRPC(server version)

async function HomePage() {
  void trpc.hello.prefetch({ text: "alireza" }); // prefetch data and save it into data cache in the server side, then client component will use this pre-fetched data
  return (
    <HydrateClient>
      <ErrorBoundary fallback={<p>error...</p>}>
        <Suspense fallback={<p>loading...</p>}>
          {/* in this client component, we can use the pre-fetched data for Leveraging speed of server components */}
          <Client />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}

export default HomePage;
