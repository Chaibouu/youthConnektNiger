"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu, X, ChevronDown,
  LayoutDashboard, User, LogOut,
  Info, Calendar, FolderKanban,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { menuItems } from "@/settings/navigation";
import appConfig from "@/settings";
import { cn } from "@/lib/utils";
import { useSession } from "@/context/SessionContext";
import { logout } from "@/actions/logout";

/* ─── Icon map ─────────────────────────────────────────── */
const iconMap: Record<string, LucideIcon> = { Info, Calendar, FolderKanban };

function SubItemIcon({ name }: { name?: string }) {
  const Icon = name ? iconMap[name] : undefined;
  return Icon ? <Icon className="h-4 w-4" /> : null;
}

/* ─── User initials ─────────────────────────────────────── */
function userInitials(name: string | null | undefined): string {
  const n = name?.trim();
  if (!n) return "?";
  const parts = n.split(/\s+/);
  return parts.length >= 2
    ? `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase()
    : n.slice(0, 2).toUpperCase();
}

/* ─── Desktop flyout dropdown ───────────────────────────── */
interface FlyoutProps {
  item: (typeof menuItems)[number];
  isActive: (href: string) => boolean;
  isParentActive: (item: (typeof menuItems)[number]) => boolean;
  transparent: boolean;
}

function FlyoutItem({ item, isActive, isParentActive, transparent }: FlyoutProps) {
  const [open, setOpen] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleClose = useCallback(() => {
    closeTimeout.current = setTimeout(() => setOpen(false), 120);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
  }, []);

  const active = isParentActive(item);

  const linkBase = cn(
    "relative flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 outline-none cursor-pointer select-none",
    transparent
      ? active
        ? "text-white"
        : "text-white/80 hover:text-white"
      : active
        ? "text-primary"
        : "text-foreground/80 hover:text-primary"
  );

  return (
    <li
      className="relative"
      onMouseEnter={() => { cancelClose(); setOpen(true); }}
      onMouseLeave={scheduleClose}
    >
      <button className={linkBase} aria-expanded={open}>
        {/* Active pill (spring) */}
        {active && (
          <motion.span
            layoutId="nav-pill"
            className={cn(
              "absolute inset-0 rounded-lg",
              transparent ? "bg-white/15" : "bg-primary/10"
            )}
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
          />
        )}
        <span className="relative">{item.label}</span>
        <ChevronDown
          className={cn(
            "relative h-3.5 w-3.5 transition-transform duration-200",
            open ? "rotate-180" : ""
          )}
        />
      </button>

      {/* Flyout panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-border/70 bg-white shadow-xl shadow-black/10"
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            {/* Top accent */}
            <div className="h-0.5 w-full bg-gradient-to-r from-primary via-primary/80 to-secondary" />

            <div className="p-2">
              {item.children?.map((child) => {
                const childActive = isActive(child.href);
                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-150",
                      childActive
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted/70 hover:text-primary"
                    )}
                  >
                    {/* Icon square */}
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-150",
                        childActive
                          ? "bg-primary/15 text-primary"
                          : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                      )}
                    >
                      <SubItemIcon name={child.icon} />
                    </span>

                    {/* Text */}
                    <span className="min-w-0 flex-1">
                      <span className={cn("block truncate text-sm font-semibold", childActive && "text-primary")}>
                        {child.title}
                      </span>
                      {child.description && (
                        <span className="block truncate text-xs text-muted-foreground mt-0.5">
                          {child.description}
                        </span>
                      )}
                    </span>

                    {/* Active dot */}
                    {childActive && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    )}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

/* ─── Main Navbar ───────────────────────────────────────── */
export function Navbar() {
  const pathname = usePathname();
  const { user } = useSession();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);

  /* Scroll detection */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close mobile on route change */
  useEffect(() => {
    setMobileOpen(false);
    setOpenMobileDropdown(null);
  }, [pathname]);

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  /* Active helpers */
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  const isParentActive = (item: (typeof menuItems)[number]) =>
    isActive(item.href) || (item.children?.some((c) => isActive(c.href)) ?? false);

  /* Transparent hero mode: homepage + not scrolled */
  const isHomePage = pathname === "/";
  const transparent = isHomePage && !scrolled;

  /* ── Link style helpers ── */
  const simpleLinkClass = (href: string) =>
    cn(
      "relative block rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 cursor-pointer select-none",
      transparent
        ? isActive(href) ? "text-white" : "text-white/80 hover:text-white"
        : isActive(href) ? "text-primary" : "text-foreground/80 hover:text-primary"
    );

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-500",
          transparent
            ? "bg-gradient-to-b from-[#012e22]/80 via-[#012e22]/30 to-transparent"
            : "border-b border-border/40 bg-white/95 shadow-sm backdrop-blur-md"
        )}
      >
        {/* ── Brand accent line (visible when scrolled) ── */}
        <AnimatePresence>
          {scrolled && (
            <motion.div
              key="accent-line"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute top-0 left-0 right-0 h-0.5 origin-left bg-gradient-to-r from-primary via-primary/70 to-secondary"
            />
          )}
        </AnimatePresence>

        <nav className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">

          {/* ── Logo ── */}
          <Link href="/" className="group flex shrink-0 items-center gap-2.5">
            <span
              className={cn(
                "relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full shadow-md transition-transform duration-200 group-hover:scale-105",
                transparent ? "ring-2 ring-white/40" : "ring-2 ring-primary/20"
              )}
            >
              <Image
                src={appConfig.logoUrl}
                alt={appConfig.appName}
                fill
                className="object-cover"
                sizes="36px"
              />
            </span>
            <span
              className={cn(
                "hidden text-sm font-bold tracking-tight transition-colors duration-200 sm:block",
                transparent
                  ? "text-white group-hover:text-white/80"
                  : "text-primary group-hover:text-primary/80"
              )}
            >
              Youth Connekt{" "}
              <span className={transparent ? "text-secondary" : "text-secondary"}>
                Niger
              </span>
            </span>
          </Link>

          {/* ── Desktop nav ── */}
          <ul className="hidden items-center gap-0.5 md:flex">
            {menuItems.map((item) =>
              item.children && item.children.length > 0 ? (
                <FlyoutItem
                  key={item.href}
                  item={item}
                  isActive={isActive}
                  isParentActive={isParentActive}
                  transparent={transparent}
                />
              ) : (
                <li key={item.href} className="relative">
                  <Link href={item.href} className={simpleLinkClass(item.href)}>
                    {isActive(item.href) && (
                      <motion.span
                        layoutId="nav-pill"
                        className={cn(
                          "absolute inset-0 rounded-lg",
                          transparent ? "bg-white/15" : "bg-primary/10"
                        )}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                    <span className="relative">{item.label}</span>
                  </Link>
                  {/* Active underline dot */}
                  {isActive(item.href) && (
                    <motion.span
                      layoutId="nav-dot"
                      className="absolute -bottom-px left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-secondary"
                      transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                    />
                  )}
                </li>
              )
            )}
          </ul>

          {/* ── Desktop auth ── */}
          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label="Menu du compte"
                    className="rounded-full transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
                  >
                    <Avatar
                      className={cn(
                        "h-9 w-9 shadow-sm",
                        transparent ? "border-2 border-white/40" : "border-2 border-primary/25"
                      )}
                    >
                      <AvatarImage src={user.image ?? ""} alt="" />
                      <AvatarFallback className="bg-primary text-sm font-semibold text-primary-foreground">
                        {userInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-52 rounded-xl shadow-lg border-border/60 overflow-hidden"
                  sideOffset={8}
                >
                  <div className="h-0.5 bg-gradient-to-r from-primary to-secondary" />
                  <div className="px-3 py-2.5 border-b border-border/60">
                    <p className="truncate text-sm font-semibold">{user.name}</p>
                    {user.email && (
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    )}
                  </div>
                  <div className="p-1">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2">
                        <LayoutDashboard className="h-4 w-4 shrink-0 text-primary" />
                        Tableau de bord
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/profile" className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2">
                        <User className="h-4 w-4 shrink-0 text-primary" />
                        Profil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="flex cursor-pointer items-center gap-2 text-destructive focus:text-destructive rounded-lg px-3 py-2"
                      onSelect={(e) => { e.preventDefault(); void logout(); }}
                    >
                      <LogOut className="h-4 w-4 shrink-0" />
                      Se déconnecter
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className={cn(
                    "rounded-lg text-sm font-medium cursor-pointer transition-all duration-150",
                    transparent
                      ? "text-white/85 hover:bg-white/15 hover:text-white"
                      : "hover:bg-primary/10 hover:text-primary"
                  )}
                >
                  <Link href="/auth/login">Se connecter</Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="rounded-full bg-secondary px-5 font-semibold text-white shadow-md shadow-secondary/25 transition-all duration-200 hover:bg-secondary/90 hover:shadow-secondary/35 hover:shadow-lg cursor-pointer"
                >
                  <Link href="/auth/signup">S&apos;inscrire</Link>
                </Button>
              </>
            )}
          </div>

          {/* ── Mobile toggle ── */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "md:hidden cursor-pointer rounded-xl transition-colors duration-150",
              transparent ? "text-white hover:bg-white/15" : "hover:bg-primary/10"
            )}
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="h-5 w-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="h-5 w-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </Button>

        </nav>
      </header>

      {/* ── Mobile overlay backdrop ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Mobile menu panel ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-panel"
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed left-0 right-0 top-16 z-50 mx-3 overflow-hidden rounded-2xl border border-border/60 bg-white shadow-2xl md:hidden"
          >
            {/* Top accent */}
            <div className="h-0.5 bg-gradient-to-r from-primary via-primary/80 to-secondary" />

            <div className="max-h-[calc(100dvh-5rem)] overflow-y-auto">
              <ul className="flex flex-col gap-1 p-3">
                {menuItems.map((item, idx) =>
                  item.children && item.children.length > 0 ? (
                    <motion.li
                      key={item.href}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.04, duration: 0.2 }}
                      className="flex flex-col"
                    >
                      {/* Parent button */}
                      <button
                        onClick={() =>
                          setOpenMobileDropdown((p) => p === item.href ? null : item.href)
                        }
                        className={cn(
                          "flex w-full cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors duration-150",
                          isParentActive(item)
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        <span className="flex items-center gap-2.5">
                          {isParentActive(item) && (
                            <span className="h-4 w-0.5 rounded-full bg-secondary flex-shrink-0" />
                          )}
                          {item.label}
                        </span>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 text-muted-foreground transition-transform duration-200",
                            openMobileDropdown === item.href ? "rotate-180 text-primary" : ""
                          )}
                        />
                      </button>

                      {/* Children accordion */}
                      <AnimatePresence>
                        {openMobileDropdown === item.href && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="overflow-hidden pl-2"
                          >
                            <div className="mt-1 space-y-0.5 rounded-xl border border-border/50 bg-muted/30 p-1.5">
                              {item.children.map((child) => (
                                <li key={child.href}>
                                  <Link
                                    href={child.href}
                                    className={cn(
                                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-150 cursor-pointer",
                                      isActive(child.href)
                                        ? "bg-white text-primary font-semibold shadow-sm"
                                        : "text-muted-foreground hover:bg-white hover:text-foreground"
                                    )}
                                  >
                                    <span
                                      className={cn(
                                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
                                        isActive(child.href)
                                          ? "bg-primary/10 text-primary"
                                          : "bg-muted text-muted-foreground"
                                      )}
                                    >
                                      <SubItemIcon name={child.icon} />
                                    </span>
                                    <span className="flex-1 truncate text-xs font-medium">{child.title}</span>
                                    {isActive(child.href) && (
                                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                                    )}
                                  </Link>
                                </li>
                              ))}
                            </div>
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </motion.li>
                  ) : (
                    <motion.li
                      key={item.href}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.04, duration: 0.2 }}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "flex cursor-pointer items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors duration-150",
                          isActive(item.href)
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-foreground hover:bg-muted hover:text-primary"
                        )}
                      >
                        {isActive(item.href) && (
                          <span className="h-4 w-0.5 shrink-0 rounded-full bg-secondary" />
                        )}
                        {item.label}
                      </Link>
                    </motion.li>
                  )
                )}
              </ul>

              {/* Divider */}
              <div className="mx-3 h-px bg-border/60" />

              {/* Auth section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: menuItems.length * 0.04 + 0.05 }}
                className="p-3"
              >
                {user ? (
                  <div className="flex flex-col gap-1">
                    {/* User card */}
                    <div className="mb-1 flex items-center gap-3 rounded-xl bg-muted/50 px-3 py-2.5">
                      <Avatar className="h-10 w-10 border-2 border-primary/20 shrink-0">
                        <AvatarImage src={user.image ?? ""} alt="" />
                        <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                          {userInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{user.name}</p>
                        {user.email && (
                          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                        )}
                      </div>
                    </div>

                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors duration-150"
                    >
                      <LayoutDashboard className="h-4 w-4 shrink-0 text-primary/70" />
                      Tableau de bord
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors duration-150"
                    >
                      <User className="h-4 w-4 shrink-0 text-primary/70" />
                      Profil
                    </Link>
                    <button
                      type="button"
                      onClick={() => void logout()}
                      className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/8 transition-colors duration-150"
                    >
                      <LogOut className="h-4 w-4 shrink-0" />
                      Se déconnecter
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" className="w-full rounded-xl cursor-pointer font-medium" asChild>
                      <Link href="/auth/login">Se connecter</Link>
                    </Button>
                    <Button
                      className="w-full rounded-xl bg-secondary font-semibold text-white shadow-md shadow-secondary/20 hover:bg-secondary/90 cursor-pointer transition-all duration-200"
                      asChild
                    >
                      <Link href="/auth/signup">S&apos;inscrire gratuitement</Link>
                    </Button>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
