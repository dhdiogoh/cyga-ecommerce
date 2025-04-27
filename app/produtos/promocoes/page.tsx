"use client"

import { produtos } from "@/lib/produtos"
import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ChevronDown } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

export default function PromocoesPage() {
  // Simulando produtos em promoção (últimos 6 produtos)
  const produtosPromocao = produtos.slice(-6).map((produto) => ({
    ...produto,
    precoOriginal: produto.preco,
    preco: `R$ ${(Number(produto.preco.replace("R$ ", "").replace(",", ".")) * 0.8).toFixed(2).replace(".", ",")}`,
  }))

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [produtosFiltrados, setProdutosFiltrados] = useState(produtosPromocao)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[40vh] w-full">
        <Image
          src="/placeholder.svg?height=600&width=1600&text=SALE"
          alt="Promoções CYGA"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
          <h1 className="text-4xl md:text-6xl font-light mb-4">SALE</h1>
          <p className="text-xl md:text-2xl font-light max-w-2xl">Aproveite nossas ofertas especiais</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filtros - Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <h2 className="text-lg font-medium mb-4">Filtros</h2>

              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Categoria</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="aneis" className="mr-2" />
                    <label htmlFor="aneis" className="text-sm">
                      Anéis
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="colares" className="mr-2" />
                    <label htmlFor="colares" className="text-sm">
                      Colares
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="brincos" className="mr-2" />
                    <label htmlFor="brincos" className="text-sm">
                      Brincos
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="pulseiras" className="mr-2" />
                    <label htmlFor="pulseiras" className="text-sm">
                      Pulseiras
                    </label>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Desconto</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="desconto1" className="mr-2" />
                    <label htmlFor="desconto1" className="text-sm">
                      Até 20%
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="desconto2" className="mr-2" />
                    <label htmlFor="desconto2" className="text-sm">
                      20% - 30%
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="desconto3" className="mr-2" />
                    <label htmlFor="desconto3" className="text-sm">
                      Acima de 30%
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Button variant="outline" className="w-full rounded-none">
                  Limpar Filtros
                </Button>
                <Button className="w-full rounded-none">Aplicar Filtros</Button>
              </div>
            </div>
          </div>

          {/* Produtos */}
          <div className="lg:col-span-3">
            {/* Filtros Mobile */}
            <div className="lg:hidden mb-6">
              <Button
                variant="outline"
                className="w-full flex items-center justify-between rounded-none"
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              >
                <span>Filtros</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${mobileFiltersOpen ? "rotate-180" : ""}`}
                />
              </Button>
            </div>

            {/* Ordenação */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-muted-foreground">{produtosFiltrados.length} produtos</p>
              <div className="flex items-center">
                <span className="text-sm mr-2">Ordenar por:</span>
                <select className="text-sm border p-1">
                  <option value="recentes">Mais recentes</option>
                  <option value="preco-asc">Preço: menor para maior</option>
                  <option value="preco-desc">Preço: maior para menor</option>
                  <option value="desconto">Maior desconto</option>
                </select>
              </div>
            </div>

            {/* Grid de Produtos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {produtosFiltrados.length > 0 ? (
                produtosFiltrados.map((produto) => (
                  <div key={produto.id} className="relative">
                    <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-xs px-2 py-1">-20%</div>
                    <ProductCard produto={produto} />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-lg font-light mb-4">Nenhum produto encontrado</p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Tente ajustar os filtros para encontrar o que procura.
                  </p>
                  <Button variant="outline" className="rounded-none">
                    Limpar Filtros
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
