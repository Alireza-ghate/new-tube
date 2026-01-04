"use client";

import UserAvatar from "@/components/shared/user-avatar";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import { ListIcon } from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function LoadingSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <SidebarMenuItem key={index}>
          <SidebarMenuButton disabled>
            <Skeleton className="size-6 rounded-full shrink-0" />
            <Skeleton className="h-4 w-full" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
}

function SubscriptionsSection() {
  const pathname = usePathname();
  const { data, isLoading } = trpc.subscriptions.getMany.useInfiniteQuery(
    { limit: DEFAULT_LIMIT },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  ); //get all subscriptions from db

  if (data?.pages.flatMap((page) => page.items).length === 0) return null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Subscriptions</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {isLoading && <LoadingSkeleton />}
          {!isLoading &&
            data?.pages
              .flatMap((page) => page.items)
              .map((subscription) => (
                <SidebarMenuItem
                  key={`${subscription.creatorId}-${subscription.viewerId}`}
                >
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === `/users/${subscription.user.id}`}
                    tooltip={subscription.user.name}
                  >
                    <Link
                      prefetch
                      className="flex items-center gap-x-4"
                      href={`/users/${subscription.user.id}`}
                    >
                      <UserAvatar
                        size="xs"
                        imageUrl={subscription.user.imageUrl}
                        name={subscription.user.name}
                      />
                      <span>{subscription.user.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
          {!isLoading && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="See all subscriptions"
                isActive={pathname === "/subscriptions"}
              >
                <Link
                  prefetch
                  href="/subscriptions"
                  className="flex items-center gap-x-4"
                >
                  <ListIcon className="size-4" />
                  <span className="text-sm">All subscriptions</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export default SubscriptionsSection;
