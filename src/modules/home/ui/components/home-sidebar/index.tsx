import {
  Sidebar,
  SidebarContent,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import MainSection from "./main-section";
import PersonalSection from "./personal-section";

function HomeSidebar() {
  return (
    <Sidebar className="pt-16 border-none z-40" collapsible="icon">
      <SidebarContent className="bg-background">
        <MainSection />
        {/* <Separator /> */}
        <SidebarSeparator />
        {/* render for both authenticated and unauthenticated users */}
        <PersonalSection />
      </SidebarContent>
    </Sidebar>
  );
}

export default HomeSidebar;
