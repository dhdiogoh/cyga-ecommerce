"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Search, ShoppingBag, User, Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useCart } from "@/contexts/cart-context"

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { itemCount } = useCart()

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="container mx-auto px-4">
        {/* Topo do Header - Logo e Ícones */}
        <div className="flex items-center justify-between py-6">
          {/* Ícone de Busca (esquerda) */}
          <div className="w-10">
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-0">
              {isSearchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
              <span className="sr-only">Buscar</span>
            </Button>
          </div>

          {/* Logo (centro) */}
          <Link href="/" className="text-black text-4xl font-light">
            cyga.
          </Link>

          {/* Ícones de Usuário e Carrinho (direita) */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" asChild className="p-0">
              <Link href="/login">
                <User className="h-4 w-4" />
                <span className="sr-only">Minha Conta</span>
              </Link>
            </Button>

            <Button variant="ghost" size="icon" asChild className="p-0">
              <Link href="/carrinho">
                <div className="relative">
                  <ShoppingBag className="h-4 w-4" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="sr-only">Carrinho</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Menu de Navegação (Desktop) */}
        <nav className="hidden md:flex items-center justify-center space-x-8 py-4 text-sm font-light">
          <Link href="/" className="text-neutral-700 hover:text-black">
            home
          </Link>
          <Link href="/novidades" className="text-neutral-700 hover:text-black">
            news
          </Link>
          <Link href="/produtos/aneis" className="text-neutral-700 hover:text-black">
            anéis
          </Link>
          <Link href="/produtos/chokers" className="text-neutral-700 hover:text-black">
            chokers
          </Link>
          <Link href="/produtos/colares" className="text-neutral-700 hover:text-black">
            colares
          </Link>
          <Link href="/produtos/brincos" className="text-neutral-700 hover:text-black">
            brincos
          </Link>
          <Link href="/produtos/pulseiras" className="text-neutral-700 hover:text-black">
            pulseiras
          </Link>
          <Link href="/produtos/conjuntos" className="text-neutral-700 hover:text-black">
            conjuntos
          </Link>
          <Link href="/produtos/best-seller" className="text-neutral-700 hover:text-black">
            best seller
          </Link>
          <Link href="/for-men" className="text-neutral-700 hover:text-black">
            cyga for men
          </Link>
          <Link href="/produtos/promocoes" className="text-neutral-700 hover:text-black uppercase">
            sale
          </Link>
        </nav>

        {/* Menu Mobile */}
        <div className="md:hidden flex items-center justify-between py-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="p-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-6 mt-12">
                <Link href="/" className="text-neutral-700 hover:text-black">
                  home
                </Link>
                <Link href="/novidades" className="text-neutral-700 hover:text-black">
                  news
                </Link>
                <Link href="/produtos/aneis" className="text-neutral-700 hover:text-black">
                  anéis
                </Link>
                <Link href="/produtos/chokers" className="text-neutral-700 hover:text-black">
                  chokers
                </Link>
                <Link href="/produtos/colares" className="text-neutral-700 hover:text-black">
                  colares
                </Link>
                <Link href="/produtos/brincos" className="text-neutral-700 hover:text-black">
                  brincos
                </Link>
                <Link href="/produtos/pulseiras" className="text-neutral-700 hover:text-black">
                  pulseiras
                </Link>
                <Link href="/produtos/conjuntos" className="text-neutral-700 hover:text-black">
                  conjuntos
                </Link>
                <Link href="/produtos/best-seller" className="text-neutral-700 hover:text-black">
                  best seller
                </Link>
                <Link href="/for-men" className="text-neutral-700 hover:text-black">
                  cyga for men
                </Link>
                <Link href="/produtos/promocoes" className="text-neutral-700 hover:text-black uppercase">
                  sale
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Barra de Busca */}
        {isSearchOpen && (
          <div className="py-4 border-t">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="O que você está procurando?" className="pl-10 rounded-none text-sm" autoFocus />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
