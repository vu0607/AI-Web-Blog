
'use client';

import React from 'react';
import Link from 'next/link';
import { Icons } from '@/components/icons';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: keyof typeof Icons;
  isActive?: (pathname: string) => boolean;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Home', icon: 'home', isActive: (pathname) => pathname === '/' },
  { href: '/admin', label: 'Admin', icon: 'settings', isActive: (pathname) => pathname.startsWith('/admin') },
  // Add more navigation items here if needed
];

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4 items-center flex gap-2">
           {/* Placeholder for Logo */}
           <div className="bg-primary text-primary-foreground p-2 rounded-md">
            <Icons.bot className="h-6 w-6" />
           </div>
           <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">AI Blog</span>
          <SidebarTrigger className="ml-auto md:hidden" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => {
              const Icon = Icons[item.icon];
              const active = item.isActive ? item.isActive(pathname) : pathname === item.href;
              return (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} legacyBehavior passHref>
                    <SidebarMenuButton
                      tooltip={item.label}
                      isActive={active}
                    >
                      <Icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
        {/* Optional Footer */}
        {/* <SidebarFooter>
          <Button variant="ghost">Footer Button</Button>
        </SidebarFooter> */}
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b md:border-none">
          {/* Mobile Sidebar Trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <SidebarTrigger />
            <span className="font-semibold">AI Blog</span>
          </div>
          {/* Header content for larger screens (optional) */}
          <div className="hidden md:flex grow">
             {/* Search Bar or other header elements */}
          </div>
           <div className="flex items-center gap-2">
              <Link href="/login" passHref legacyBehavior>
                <Button variant="outline" size="sm">Login</Button>
              </Link>
              <Link href="/register" passHref legacyBehavior>
                 <Button size="sm">Register</Button>
              </Link>
           </div>
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
        <footer className="p-4 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} AI Blog Central. All rights reserved.
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
