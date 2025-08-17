import { SidebarProvider } from "@/components/ui/sidebar";
import { type ReactNode } from "react";
import HomeNavbar from "../components/home-navbar";
import HomeSidebar from "../components/home-sidebar";

interface HomeLayoutProps {
  children: ReactNode;
}

export function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <SidebarProvider>
      <div className="w-full">
        <HomeNavbar />
        {/* give pt-16 as height for navbar(h-16) */}
        <div className="flex min-h-screen pt-16">
          <HomeSidebar />
          {/* children === evrything returned from page.tsx of our pages */}
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
