"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import {
  Leaf,
  Search,
  User,
  ShoppingBag,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS, STORE_NAME } from "@/lib/constants";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SearchOverlay } from "@/components/layout/search-overlay";

import { useCart } from "@/store/useCart";
import { useAuth } from "@/context/AuthContext";

const SCROLL_THRESHOLD = 20;

export function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Use auth state
  const { user, loading } = useAuth();
  
  // Use cart store
  const { cartCount, setIsOpen } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > SCROLL_THRESHOLD);
  });

  // Close mobile nav on route change
  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [pathname]);

  return (
    <>
      <AnnouncementBar />

      <motion.header
        className={cn(
          "sticky top-0 z-40 w-full",
          "transition-[backdrop-filter,background-color,box-shadow] duration-300"
        )}
        animate={{
          backgroundColor: isScrolled
            ? "rgba(250, 250, 247, 0.85)"
            : "rgba(250, 250, 247, 1)",
          backdropFilter: isScrolled ? "blur(12px)" : "blur(0px)",
          boxShadow: isScrolled
            ? "0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.06)"
            : "0 0 0 0 rgba(0, 0, 0, 0)",
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex items-center justify-between"
            animate={{ height: isScrolled ? 60 : 72 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Left: Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <motion.div
                className={cn(
                  "flex items-center justify-center rounded-lg",
                  "bg-sage-100 group-hover:bg-sage-200",
                  "transition-colors duration-200"
                )}
                animate={{ width: isScrolled ? 32 : 36, height: isScrolled ? 32 : 36 }}
                transition={{ duration: 0.3 }}
              >
                <Leaf className="size-5 text-sage-600" />
              </motion.div>
              <motion.span
                className="font-semibold text-foreground tracking-tight"
                animate={{ fontSize: isScrolled ? "1.125rem" : "1.25rem" }}
                transition={{ duration: 0.3 }}
              >
                {STORE_NAME.split(" ")[0]}
              </motion.span>
            </Link>

            {/* Center: Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Navegación principal">
              {NAV_LINKS.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 cursor-pointer",
                      isActive
                        ? "text-sage-700"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-5 rounded-full bg-sage-500"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className={cn(
                  "p-2.5 rounded-lg text-muted-foreground",
                  "hover:text-foreground hover:bg-muted cursor-pointer hover:scale-105 transition-all duration-300"
                )}
                aria-label="Buscar productos"
              >
                <Search className="size-5" />
              </button>

              {/* Account */}
              {!loading && (
                <Link
                  href={user ? "/perfil" : "/login"}
                  className={cn(
                    "hidden sm:flex items-center gap-2 p-2.5 rounded-lg text-muted-foreground cursor-pointer hover:scale-105 transition-all duration-300",
                    "hover:text-foreground hover:bg-muted",
                    "transition-colors duration-200"
                  )}
                  aria-label={user ? "Mi cuenta" : "Iniciar sesión"}
                >
                  {user ? (
                    <div className="w-6 h-6 rounded-full bg-sage-200 flex items-center justify-center text-xs font-medium text-sage-800">
                      {user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase() || <User className="size-4" />}
                    </div>
                  ) : (
                    <User className="size-5" />
                  )}
                </Link>
              )}

              {/* Cart */}
              <button
                onClick={() => setIsOpen(true)}
                className={cn(
                  "relative p-2.5 rounded-lg text-muted-foreground cursor-pointer hover:scale-105 transition-all duration-300",
                  "hover:text-foreground hover:bg-muted",
                  "transition-colors duration-200"
                )}
                aria-label={`Carrito de compras, ${mounted ? cartCount : 0} productos`}
              >
                <ShoppingBag className="size-5" />
                {mounted && cartCount > 0 && (
                  <span
                    className={cn(
                      "absolute -top-0.5 -right-0.5",
                      "flex items-center justify-center",
                      "min-w-[18px] h-[18px] px-1",
                      "rounded-full bg-sage-500 text-white",
                      "text-[10px] font-bold leading-none"
                    )}
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileNavOpen(true)}
                className={cn(
                  "md:hidden p-2.5 rounded-lg text-muted-foreground cursor-pointer hover:scale-105 transition-all duration-300",
                  "hover:text-foreground hover:bg-muted",
                  "transition-colors duration-200"
                )}
                aria-label="Abrir menú"
                aria-expanded={isMobileNavOpen}
              >
                <Menu className="size-5" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Subtle bottom border */}
        <div className="h-px bg-border" />
      </motion.header>

      {/* Mobile Navigation Overlay */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />

      {/* Full Screen Search Overlay */}
      <SearchOverlay 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}

export default Header;
