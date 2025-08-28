import { SidebarTrigger } from "@/components/ui/sidebar";
import AuthButton from "@/modules/auth/ui/components/auth-button";
import Image from "next/image";
import Link from "next/link";
import StudioUploadModal from "../studio-upload-modal";

function StudioNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 px-2 pr-5 z-50 border-b shadow-md">
      {/* navbar content goes here (container) */}
      <div className="flex items-center gap-x-4">
        {/* Menu and Logo */}
        <div className="flex items-center flex-shrink-0">
          <SidebarTrigger />
          <Link href="/studio">
            <div className="flex items-center gap-x-1 p-4">
              <Image src="/logo.svg" width={32} height={32} alt="logo" />
              <p className="text-xl font-semibold tracking-tight">Studio</p>
            </div>
          </Link>
        </div>

        {/* spacer or justify-between in its flex container */}
        <div className="flex-1" />

        {/* Signin button */}
        <div className="flex items-center flex-shrink-0 gap-x-4">
          <StudioUploadModal />
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}

export default StudioNavbar;
