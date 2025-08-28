"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth, useClerk } from "@clerk/nextjs";
import { FlameIcon, HomeIcon, PlaySquareIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// our list items that we want to render
const items = [
  {
    title: "Home",
    url: "/",
    icon: HomeIcon,
  },
  {
    title: "Subscriptions",
    url: "/feed/subscriptions",
    icon: PlaySquareIcon,
    auth: true, // depends on user is logged in or not. this item (Subscriptions) will only be rendered if the user is authenticated
  },
  {
    title: "Trending",
    url: "/feed/trending",
    icon: FlameIcon,
  },
];

function MainSection() {
  const pathname = usePathname();
  const clerk = useClerk();
  const { isSignedIn } = useAuth();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              {/* SidebarMenuButton by default renders <button> */}
              <SidebarMenuButton
                tooltip={item.title}
                asChild /* using asChild forces instead of render <button> , render <a> (from Link which is its direct child) */
                isActive={pathname === item.url}
                onClick={(e) => {
                  // if there is no user and our item has auth set to true instead of redirect user to that page, redirect user to sign in page
                  // if user didnt logged in clicks on list item which has NOT auth property, by default redirects users to url
                  //  protect any item which has auth property to avoid redirect unlogged in users
                  if (!isSignedIn && item.auth) {
                    e.preventDefault(); //without this if user clicks for short time modal pops out but after a sec redirects user to page
                    return clerk.openSignIn();
                  }
                }}
              >
                <Link className="flex items-center gap-x-4" href={item.url}>
                  <item.icon />
                  <span className="text-sm">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export default MainSection;
