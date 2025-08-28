import { SidebarProvider } from "@/components/ui/sidebar";
import { type ReactNode } from "react";
import StudioNavbar from "../components/studio-navbar";
import StudioSidebar from "../components/studio-sidebar";

interface StudioLayoutProps {
  children: ReactNode;
}

export default function StudioLayout({ children }: StudioLayoutProps) {
  return (
    <SidebarProvider>
      <div className="w-full">
        <StudioNavbar />
        {/* give pt-16 as height for navbar(h-16) */}
        <div className="flex min-h-screen pt-16">
          <StudioSidebar />
          {/* children === evrything returned from page.tsx of our pages */}
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
