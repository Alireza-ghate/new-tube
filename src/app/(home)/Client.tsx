"use client";

import { trpc } from "@/trpc/client";

// this client component will use the pre-fetched data we pre-fetched in the server component but fatser than normal client components
function Client() {
  // if we use useQuery() the speed of fetch data is much slower than using useSuspenseQuery()
  // bcs we use suspenseQuery() with HydrateClient in the server component
  // const {data, isLoading,isError} = trpc.hello.useQuery({ text: "alireza" }); // if we use useQuery() we can use isLoading and isError
  const [data] = trpc.hello.useSuspenseQuery({ text: "alireza" });
  // there is no need to use( ? )here bcs data already was pre-fetch and data never be null or undefined!
  return <div>this is client component: {data.greeting}</div>;
}

export default Client;
