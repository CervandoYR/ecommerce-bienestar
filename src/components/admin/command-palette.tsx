"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, Package, ShoppingCart, Users, LayoutDashboard, Settings } from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    const openPalette = () => setOpen(true);

    document.addEventListener("keydown", down);
    document.addEventListener("open-command-palette", openPalette);
    
    return () => {
      document.removeEventListener("keydown", down);
      document.removeEventListener("open-command-palette", openPalette);
    };
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div 
        className="w-full max-w-xl bg-white dark:bg-warm-900 border border-warm-200 dark:border-warm-800 rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="flex flex-col w-full bg-transparent text-warm-900 dark:text-white" label="Command Menu">
          <div className="flex items-center px-4 border-b border-warm-200 dark:border-warm-800">
            <Search className="w-5 h-5 text-warm-500 mr-2 shrink-0" />
            <Command.Input 
              autoFocus 
              placeholder="Busca órdenes, clientes, productos..." 
              className="flex-1 h-14 bg-transparent outline-none text-warm-900 dark:text-white placeholder:text-warm-500"
            />
            <kbd className="hidden font-sans px-2 py-0.5 bg-warm-100 dark:bg-warm-800 rounded text-xs text-warm-600 dark:text-warm-500 sm:inline-block">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-hide">
            <Command.Empty className="py-6 text-center text-sm text-warm-500">
              No se encontraron resultados.
            </Command.Empty>

            <Command.Group heading="Accesos Rápidos" className="text-xs font-medium text-warm-500 px-2 py-1.5">
              <Command.Item 
                onSelect={() => runCommand(() => router.push("/admin"))}
                className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm text-warm-700 dark:text-warm-200 cursor-pointer hover:bg-sage-100 dark:hover:bg-sage-600 hover:text-sage-900 dark:hover:text-white aria-selected:bg-sage-100 aria-selected:text-sage-900 dark:aria-selected:bg-sage-600 dark:aria-selected:text-white"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push("/admin/pedidos"))}
                className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm text-warm-700 dark:text-warm-200 cursor-pointer hover:bg-sage-100 dark:hover:bg-sage-600 hover:text-sage-900 dark:hover:text-white aria-selected:bg-sage-100 aria-selected:text-sage-900 dark:aria-selected:bg-sage-600 dark:aria-selected:text-white"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Ver Pedidos Activos</span>
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push("/admin/productos"))}
                className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm text-warm-700 dark:text-warm-200 cursor-pointer hover:bg-sage-100 dark:hover:bg-sage-600 hover:text-sage-900 dark:hover:text-white aria-selected:bg-sage-100 aria-selected:text-sage-900 dark:aria-selected:bg-sage-600 dark:aria-selected:text-white"
              >
                <Package className="w-4 h-4" />
                <span>Gestionar Productos</span>
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push("/admin/proveedores"))}
                className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm text-warm-700 dark:text-warm-200 cursor-pointer hover:bg-sage-100 dark:hover:bg-sage-600 hover:text-sage-900 dark:hover:text-white aria-selected:bg-sage-100 aria-selected:text-sage-900 dark:aria-selected:bg-sage-600 dark:aria-selected:text-white"
              >
                <Users className="w-4 h-4" />
                <span>Directorio de Proveedores</span>
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push("/admin/clientes"))}
                className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm text-warm-700 dark:text-warm-200 cursor-pointer hover:bg-sage-100 dark:hover:bg-sage-600 hover:text-sage-900 dark:hover:text-white aria-selected:bg-sage-100 aria-selected:text-sage-900 dark:aria-selected:bg-sage-600 dark:aria-selected:text-white"
              >
                <Users className="w-4 h-4" />
                <span>Base de Clientes</span>
              </Command.Item>
              <Command.Item 
                onSelect={() => runCommand(() => router.push("/admin/ajustes"))}
                className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm text-warm-700 dark:text-warm-200 cursor-pointer hover:bg-sage-100 dark:hover:bg-sage-600 hover:text-sage-900 dark:hover:text-white aria-selected:bg-sage-100 aria-selected:text-sage-900 dark:aria-selected:bg-sage-600 dark:aria-selected:text-white"
              >
                <Settings className="w-4 h-4" />
                <span>Ajustes de la Tienda</span>
              </Command.Item>
            </Command.Group>

            <Command.Separator className="h-px bg-warm-200 dark:bg-warm-800 my-2" />

            <Command.Group heading="Acciones Recientes" className="text-xs font-medium text-warm-500 px-2 py-1.5">
              <Command.Item 
                onSelect={() => runCommand(() => router.push("/admin/productos/nuevo"))}
                className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm text-warm-700 dark:text-warm-200 cursor-pointer hover:bg-sage-100 dark:hover:bg-sage-600 hover:text-sage-900 dark:hover:text-white aria-selected:bg-sage-100 aria-selected:text-sage-900 dark:aria-selected:bg-sage-600 dark:aria-selected:text-white"
              >
                <Package className="w-4 h-4" />
                <span>Agregar nuevo producto</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
