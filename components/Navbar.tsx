"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, LayoutDashboard, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { menuItems } from "@/settings/navigation";
import appConfig from "@/settings";
import { cn } from "@/lib/utils";
import { useSession } from "@/context/SessionContext";
import { logout } from "@/actions/logout";

function userInitials(name: string | null | undefined): string {
  const n = name?.trim();
  if (!n) return "?";
  const parts = n.split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
  }
  return n.slice(0, 2).toUpperCase();
}

export function Navbar() {
  const pathname = usePathname();
  const { user } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="relative flex h-10 w-10 overflow-hidden rounded-full bg-white ring-2 ring-white shadow-md">
            <Image
              src={appConfig.logoUrl}
              alt={appConfig.appName}
              fill
              className="object-cover"
              sizes="40px"
            />
          </span>
          <span className="hidden font-semibold text-primary sm:inline-block">
            {appConfig.appName}
          </span>
        </Link>

        {/* Liens centrés - Desktop */}
        <ul className="hidden items-center gap-1 md:flex">
          {menuItems.map((item) =>
            item.children && item.children.length > 0 ? (
              <li key={item.href}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary",
                        pathname === item.href ? "text-primary" : "text-foreground"
                      )}
                    >
                      {item.label}
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.href} asChild>
                        <Link href={child.href}>{child.title}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            ) : (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary",
                    pathname === item.href ? "text-primary" : "text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            )
          )}
        </ul>

        {/* Auth / compte — Desktop */}
        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="rounded-full ring-offset-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="Menu du compte"
                >
                  <Avatar className="h-9 w-9 border-2 border-primary/25 shadow-sm">
                    <AvatarImage src={user.image ?? ""} alt="" />
                    <AvatarFallback className="bg-primary text-sm font-semibold text-primary-foreground">
                      {userInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <div className="px-2 py-1.5">
                  <p className="truncate text-sm font-medium">{user.name}</p>
                  {user.email ? (
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  ) : null}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard"
                    className="flex cursor-pointer items-center"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4 shrink-0" />
                    Tableau de bord
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/profile"
                    className="flex cursor-pointer items-center"
                  >
                    <User className="mr-2 h-4 w-4 shrink-0" />
                    Profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex cursor-pointer items-center text-destructive focus:text-destructive"
                  onSelect={(e) => {
                    e.preventDefault();
                    void logout();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4 shrink-0" />
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">Se connecter</Link>
              </Button>
              <Button size="sm" asChild className="bg-primary hover:bg-primary/90">
                <Link href="/auth/signup">S&apos;inscrire</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t bg-background/95 backdrop-blur md:hidden">
          <ul className="container mx-auto flex flex-col gap-1 px-4 py-4">
            {menuItems.map((item) =>
              item.children && item.children.length > 0 ? (
                <li key={item.href} className="flex flex-col gap-1">
                  <span className="px-3 py-2 text-sm font-semibold text-foreground">
                    {item.label}
                  </span>
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "rounded-md px-4 py-2 text-sm",
                        pathname === child.href ? "bg-primary/10 text-primary" : "text-muted-foreground"
                      )}
                    >
                      {child.title}
                    </Link>
                  ))}
                </li>
              ) : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block rounded-md px-3 py-2 text-sm font-medium",
                      pathname === item.href ? "bg-primary/10 text-primary" : "text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            )}
            <li className="mt-4 flex flex-col gap-3 border-t pt-4">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <Avatar className="h-11 w-11 border-2 border-primary/25">
                      <AvatarImage src={user.image ?? ""} alt="" />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {userInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{user.name}</p>
                      {user.email ? (
                        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                      ) : null}
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-primary/10 hover:text-primary"
                  >
                    <LayoutDashboard className="h-4 w-4 shrink-0" />
                    Tableau de bord
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-primary/10 hover:text-primary"
                  >
                    <User className="h-4 w-4 shrink-0" />
                    Profil
                  </Link>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => {
                      setMobileOpen(false);
                      void logout();
                    }}
                  >
                    <LogOut className="h-4 w-4 shrink-0" />
                    Se déconnecter
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                      Se connecter
                    </Link>
                  </Button>
                  <Button className="w-full bg-primary hover:bg-primary/90" asChild>
                    <Link href="/auth/signup" onClick={() => setMobileOpen(false)}>
                      S&apos;inscrire
                    </Link>
                  </Button>
                </>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
