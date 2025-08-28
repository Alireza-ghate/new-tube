import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// by default middleware dosent protect anything! all routes are public!
// here midleware only protects "/studio" rout here not the nested routs
// for protect also mested subroutes we use (.*)
const isProtectedRoute = createRouteMatcher(["/studio(.*)"]);
export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
