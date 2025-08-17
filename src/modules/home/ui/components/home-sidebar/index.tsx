import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import MainSection from "./main-section";
import { Separator } from "@/components/ui/separator";
import PersonalSection from "./personal-section";

function HomeSidebar() {
  return (
    <Sidebar className="pt-16 border-none z-40" collapsible="icon">
      <SidebarContent className="bg-background">
        <MainSection />
        <Separator />
        {/* render for both authenticated and unauthenticated users */}
        <PersonalSection />
      </SidebarContent>
    </Sidebar>
  );
}

export default HomeSidebar;
