import {
  Sidebar,
  SidebarContent,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import MainSection from "./main-section";
import PersonalSection from "./personal-section";
import SubscriptionsSection from "./subscriptions-section";
import { SignedIn } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";

function HomeSidebar() {
  return (
    <Sidebar className="pt-16 border-none z-40" collapsible="icon">
      <SidebarContent className="bg-background">
        <MainSection />
        {/* <Separator /> */}
        <SidebarSeparator />
        {/* render for both authenticated and unauthenticated users */}
        <PersonalSection />
        <SignedIn>
          <>
            <Separator />
            <SubscriptionsSection />
          </>
        </SignedIn>
      </SidebarContent>
    </Sidebar>
  );
}

export default HomeSidebar;
