"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { FlameIcon, HomeIcon, PlaySquareIcon } from "lucide-react";
import Link from "next/link";

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
                isActive={false}
                onClick={() => {}}
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
