'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Settings, UserCircle, Menu, Search, Bell, Calendar as CalendarIcon } from 'lucide-react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { HesaabProLogo } from '@/components/icons';
import { navItems } from '@/lib/data';
import { Input } from '@/components/ui/input';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const sidebarContent = (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-3 p-2">
          <HesaabProLogo className="w-10 h-10 text-primary" />
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground">حساب پرو</span>
            <span className="text-xs text-muted-foreground">نسخه تجاری</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton 
                    isActive={pathname === item.href} 
                    className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className='p-4 border-t border-border/50'>
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                      JD
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">جان دو</p>
                      <p className="text-xs text-muted-foreground">demo@gmail.com</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>حساب کاربری</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="ml-2 h-4 w-4" />
                    <span>تنظیمات</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                     <Link href="/" className='w-full'>
                        <LogOut className="ml-2 h-4 w-4" />
                        <span>خروج</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
        </div>
      </SidebarFooter>
    </>
  );

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background text-foreground" dir="rtl">
        <Sidebar collapsible="icon" className="hidden lg:flex flex-col bg-card border-l">
          {sidebarContent}
        </Sidebar>
        <div className="flex flex-col flex-1">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 lg:px-6 gap-4">
             <div className="flex items-center gap-2">
                <Sheet>
                    <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="lg:hidden">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="flex flex-col bg-card border-l p-0 w-72">
                    {sidebarContent}
                    </SheetContent>
                </Sheet>
                <h1 className="text-xl font-semibold hidden md:block">خوش آمدید 👋</h1>
            </div>
            
            <div className="flex items-center gap-4 flex-1 justify-end">
                <div className="relative w-full max-w-md hidden md:block">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="جستجو..." className="pr-9" />
                </div>
                <Button variant="outline" className='hidden sm:flex items-center gap-2'>
                    <CalendarIcon className="h-4 w-4"/>
                    <span>۲۰ دی ۱۴۰۲ - ۹ بهمن ۱۴۰۲</span>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">اعلان‌ها</span>
                </Button>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 md:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
