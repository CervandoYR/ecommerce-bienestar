"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  ShoppingCart, 
  Settings, 
  LogOut,
  Leaf,
  Search,
  Users,
  Menu,
  X
} from "lucide-react";
import { logout } from "@/lib/firebase/client";
import { STORE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { CommandPalette } from "@/components/admin/command-palette";
import { ThemeToggle } from "@/components/admin/theme-toggle";

const ADMIN_LINKS = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Productos", href: "/admin/productos", icon: Package },
  { name: "Categorías", href: "/admin/categorias", icon: Tags },
  { name: "Pedidos", href: "/admin/pedidos", icon: ShoppingCart },
  { name: "Proveedores", href: "/admin/proveedores", icon: Users }, // Reusing Users for now or Truck
  { name: "Clientes", href: "/admin/clientes", icon: Users },
  { name: "Ajustes", href: "/admin/ajustes", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    // DEMO BYPASS: Para propósitos de demostración técnica, 
    // permitiremos el acceso al admin sin autenticación.
    // if (!loading) {
    //   if (!user) {
    //     router.push("/login");
    //   }
    // }
  }, [user, loading, isAdmin, router]);

  // if (loading || !user) {
  //   return (
  //     <div className="bg-warm-50 min-h-screen flex items-center justify-center">
  //       <div className="w-8 h-8 border-4 border-sage-600 border-t-transparent rounded-full animate-spin" />
  //     </div>
  //   );
  // }

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-warm-50 dark:bg-[#0A0A0A] text-warm-900 dark:text-warm-50 flex selection:bg-sage-500/30 transition-colors duration-300">
      
      {/* Mobile Backdrop */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar - Dark Glassmorphism */}
        <aside className={cn(
          "w-64 bg-white/80 dark:bg-warm-900/40 backdrop-blur-xl border-r border-warm-200 dark:border-warm-800/50 flex flex-col fixed inset-y-0 z-30 transition-transform duration-300 lg:translate-x-0 lg:flex",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="h-16 flex items-center justify-between px-6 border-b border-warm-200 dark:border-warm-800/50">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex items-center justify-center rounded-lg bg-gradient-to-br from-sage-500 to-sage-700 w-8 h-8 shadow-lg shadow-sage-900/50">
                <Leaf className="size-4 text-white" />
              </div>
              <span className="font-semibold text-warm-900 dark:text-white tracking-wide">Admin Panel</span>
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-2 -mr-2 text-warm-500 hover:text-warm-900 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Global Search Hint */}
          <div className="px-4 py-4">
            <button 
              onClick={() => document.dispatchEvent(new CustomEvent("open-command-palette"))}
              className="w-full flex items-center gap-2 px-3 py-2 bg-warm-100 dark:bg-warm-900/50 border border-warm-200 dark:border-warm-800/50 rounded-lg text-sm text-warm-500 dark:text-warm-400 hover:text-warm-900 dark:hover:text-white hover:bg-warm-200 dark:hover:bg-warm-800 transition-colors group"
            >
              <Search className="w-4 h-4" />
              <span className="flex-1 text-left">Buscar...</span>
              <kbd className="hidden font-sans px-2 py-0.5 bg-warm-200 dark:bg-warm-800 rounded text-xs text-warm-600 dark:text-warm-500 md:inline-block">
                ⌘K
              </kbd>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-2 px-4">
            <nav className="space-y-1">
              {ADMIN_LINKS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-sage-100 dark:bg-sage-500/10 text-sage-700 dark:text-sage-400 border border-sage-200 dark:border-sage-500/20"
                        : "text-warm-600 dark:text-warm-400 hover:text-warm-900 dark:hover:text-white hover:bg-warm-100 dark:hover:bg-warm-800/50 border border-transparent"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5", isActive ? "text-sage-600 dark:text-sage-400" : "text-warm-500")} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="p-4 border-t border-warm-200 dark:border-warm-800/50 flex flex-col gap-2">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 dark:hover:text-red-300 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Cerrar Sesión
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
          <header className="h-16 bg-white/80 dark:bg-warm-900/40 backdrop-blur-xl border-b border-warm-200 dark:border-warm-800/50 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 lg:hidden">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 -ml-2 text-warm-900 dark:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
              <span className="font-semibold text-warm-900 dark:text-white">Admin Panel</span>
            </div>
            <button 
              onClick={() => document.dispatchEvent(new CustomEvent("open-command-palette"))}
              className="p-2 text-warm-500 hover:text-warm-900 dark:hover:text-white"
            >
              <Search className="w-5 h-5" />
            </button>
          </header>

          <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden">
            {children}
          </div>
        </main>

      <CommandPalette />
    </div>
  );
}
