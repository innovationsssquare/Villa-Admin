"use client";

import Nav from "@/components/Navbarcomponents/Nav";
import Sidenav from "@/components/Navbarcomponents/Sidenav";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { usePathname } from "next/navigation";

export function NextuiProviderWrapper({ children }) {
  const pathname = usePathname();

  return (
    <HeroUIProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
      >
        <section className="bg-background text-foreground transition-colors duration-300">
          {pathname !== "/Signin" ? (
            <main className="grid grid-cols-1 md:grid-cols-[auto_1fr] w-full h-screen overflow-hidden bg-background text-foreground">
              {pathname !== "/Signin" && (
                <div className="w-full">
                  <Sidenav />
                </div>
              )}

              <section className="flex flex-col w-full h-screen overflow-hidden bg-background">
                {pathname !== "/Signin" && <Nav />}
                {children}
              </section>
            </main>
          ) : (
            children
          )}
        </section>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
