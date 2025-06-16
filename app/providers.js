"use client";

import Nav from "@/components/Navbarcomponents/Nav";
import Sidenav from "@/components/Navbarcomponents/Sidenav";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HeroUIProvider } from "@heroui/react";
import { usePathname } from "next/navigation";

export function NextuiProviderWrapper({ children }) {
  const pathname = usePathname();

  return (
    <HeroUIProvider>
      <section>
       {pathname !== "/Signin" ? <main className="grid grid-cols-1 md:grid-cols-[auto_1fr] w-full h-screen overflow-hidden ">
        {pathname !== "/Signin" &&  <div className="w-full">
            <Sidenav/>
          </div>}

          <section className="flex  flex-col  w-full  h-screen   ">
          {pathname !== "/Signin" && <Nav />}
            {/* <ScrollArea className="w-full h-screen pb-14"> */}
            {children}
            {/* </ScrollArea> */}
          </section>
        </main>:children}
      </section>
    </HeroUIProvider>
  );
}
