"use client";

import UserAvatar from "@/components/shared/user-avatar";
import {
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

function StudioSidebarHeader() {
  const { user } = useUser();
  const { state } = useSidebar();

  // whenever we reload page, user will be null until user be available
  if (!user) {
    return (
      <SidebarHeader className="flex items-center justify-center pb-4">
        {/* first skeleton component, represents avatar */}
        <Skeleton className="size-[112px] rounded-full" />

        <div className="flex flex-col gap-y-2 items-center mt-2">
          <Skeleton className="h-4 w-[80px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </SidebarHeader>
    );
  }

  // if state === "collapsed", SidebarMenuItem will be returned otherwise SidebarHeader will returns
  if (state === "collapsed")
    return (
      <SidebarMenuItem className="flex items-center justify-center pb-4">
        <SidebarMenuButton asChild tooltip="Your profile">
          <Link className="justify-center items-center" href="/users/current">
            <UserAvatar
              imageUrl={user?.imageUrl}
              name={user?.fullName ?? "User"} //if fullName is null or undefined returns "User" as display name
              onClick={() => {}}
              className="size-7 transition-opacity hover:opacity-80 duration-200"
            />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );

  return (
    <SidebarHeader className="flex items-center justify-center pb-4">
      <Link href="/users/current">
        <UserAvatar
          imageUrl={user?.imageUrl}
          name={user?.fullName ?? "User"} //if fullName is null or undefined returns "User" as display name
          onClick={() => {}}
          className="size-[112px] transition-opacity hover:opacity-80 duration-200"
        />
      </Link>

      <div className="flex flex-col items-center mt-2 gap-y-1">
        <p className="text-sm font-medium">Your profile</p>
        <p className="text-muted-foreground text-xs">{user.fullName}</p>
      </div>
    </SidebarHeader>
  );
}

export default StudioSidebarHeader;
