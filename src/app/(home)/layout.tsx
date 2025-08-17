import { HomeLayout } from "@/modules/home/ui/layouts/home-layout";
import { type ReactNode } from "react";

interface LayoutProps {
  // children: ReactElement; //we use ReactElement when we exactly want children be a JSX and nothing else!
  children: ReactNode; // we use ReactNod when we want children be evrything like strings, numbers, jsx or array of these and ...
}

// evry content(JSX) returned from any co-located page.tsx will be replace with children prop
// everything this nested layout will return, will be children prop inside RootLayout(layout.tsx in app folder)
function Layout({ children }: LayoutProps) {
  return <HomeLayout>{children}</HomeLayout>;
}

export default Layout;
