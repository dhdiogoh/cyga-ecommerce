"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Package, ShoppingCart, Tag, Users } from "lucide-react"

const routes = [
  {
    label: "Início",
    icon: Home,
    href: "/dashboard",
    color: "text-black",
  },
  {
    label: "Clientes",
    icon: Users,
    href: "/dashboard/clientes",
    color: "text-black",
  },
  {
    label: "Produtos",
    icon: Package,
    href: "/dashboard/produtos",
    color: "text-black",
  },
  {
    label: "Pedidos",
    icon: ShoppingCart,
    href: "/dashboard/pedidos",
    color: "text-black",
  },
  {
    label: "Categorias",
    icon: Tag,
    href: "/dashboard/categorias",
    color: "text-black",
  },
]

interface MobileSidebarProps {
  onNavigate: () => void
}

export function MobileSidebar({ onNavigate }: MobileSidebarProps) {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-full flex-col bg-white">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center" onClick={onNavigate}>
          <h1 className="text-xl font-bold">Admin</h1>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                pathname === route.href ? "bg-black text-white" : "hover:bg-muted",
              )}
              onClick={onNavigate}
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
