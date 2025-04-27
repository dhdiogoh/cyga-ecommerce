"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { useState } from "react"

export default function CarrinhoPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdateQuantity = (id: string, quantidade: number) => {
    updateQuantity(id, quantidade)
  }

  const handleRemoveItem = (id: string) => {
    removeItem(id)
  }

  const handleUpdateCart = () => {
    setIsUpdating(true)
    setTimeout(() => {
      setIsUpdating(false)
    }, 500)
  }

  const temItensNoCarrinho = items.length > 0

  // Calcular o valor do frete (grátis para compras acima de R$ 300)
  const subtotalNumerico = Number.parseFloat(subtotal.replace("R$ ", "").replace(",", "."))
  const freteValor = subtotalNumerico >= 300 ? 0 : 19.9
  const freteFormatado = `R$ ${freteValor.toFixed(2).replace(".", ",")}`

  // Calcular o total
  const totalValor = subtotalNumerico + freteValor
  const totalFormatado = `R$ ${totalValor.toFixed(2).replace(".", ",")}`

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-xl font-light text-center tracking-wider mb-16">SEU CARRINHO</h1>

      {temItensNoCarrinho ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Itens do Carrinho */}
          <div className="lg:col-span-2">
            <div className="hidden md:grid grid-cols-5 text-sm font-medium mb-4">
              <div className="col-span-2">Produto</div>
              <div>Preço</div>
              <div>Quantidade</div>
              <div>Total</div>
            </div>

            <Separator className="mb-6" />

            {items.map((item) => {
              // Calcular o preço total do item
              const precoUnitario = Number.parseFloat(item.preco.replace("R$ ", "").replace(",", "."))
              const precoTotal = precoUnitario * item.quantidade
              const precoTotalFormatado = `R$ ${precoTotal.toFixed(2).replace(".", ",")}`

              return (
                <div key={item.id} className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    {/* Produto (Mobile e Desktop) */}
                    <div className="md:col-span-2 flex items-center space-x-4">
                      <div className="relative w-20 h-20">
                        <Image src={item.imagem || "/placeholder.svg"} alt={item.nome} fill className="object-cover" />
                      </div>
                      <div>
                        <h3 className="font-medium">{item.nome}</h3>
                        <p className="text-sm text-muted-foreground md:hidden">{item.preco}</p>
                        <button
                          className="text-sm text-red-500 flex items-center mt-1 md:hidden"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Remover
                        </button>
                      </div>
                    </div>

                    {/* Preço (Desktop) */}
                    <div className="hidden md:block">{item.preco}</div>

                    {/* Quantidade */}
                    <div>
                      <div className="flex items-center border w-32">
                        <button
                          className="px-3 py-2"
                          onClick={() => handleUpdateQuantity(item.id, item.quantidade - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantidade}
                          onChange={(e) =>
                            handleUpdateQuantity(item.id, Math.max(1, Number.parseInt(e.target.value) || 1))
                          }
                          className="w-full text-center border-none"
                        />
                        <button
                          className="px-3 py-2"
                          onClick={() => handleUpdateQuantity(item.id, item.quantidade + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between">
                      <span className="md:hidden font-medium">Total:</span>
                      <span>{precoTotalFormatado}</span>
                      <button className="text-red-500 hidden md:block" onClick={() => handleRemoveItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <Separator className="my-6" />
                </div>
              )
            })}

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <Button asChild variant="outline" className="rounded-none text-xs tracking-wider h-10">
                <Link href="/produtos">CONTINUAR COMPRANDO</Link>
              </Button>

              <Button
                variant="outline"
                className="rounded-none text-xs tracking-wider h-10"
                onClick={handleUpdateCart}
                disabled={isUpdating}
              >
                {isUpdating ? "ATUALIZANDO..." : "ATUALIZAR CARRINHO"}
              </Button>
            </div>
          </div>

          {/* Resumo do Pedido */}
          <div>
            <div className="border p-6">
              <h2 className="text-lg font-medium mb-4">Resumo do Pedido</h2>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete</span>
                  <span>{freteValor === 0 ? "Grátis" : freteFormatado}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between font-medium text-lg mb-6">
                <span>Total</span>
                <span>{totalFormatado}</span>
              </div>

              <Button asChild className="w-full rounded-none text-xs tracking-wider h-12">
                <Link href="/checkout">FINALIZAR COMPRA</Link>
              </Button>

              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Cupom de Desconto</h3>
                <div className="flex">
                  <input type="text" placeholder="Digite seu cupom" className="flex-grow border px-3 py-2 text-sm" />
                  <Button variant="outline" className="rounded-none">
                    APLICAR
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-light mb-4">Seu carrinho está vazio</h2>
          <p className="text-muted-foreground mb-8">Adicione produtos ao seu carrinho para continuar comprando.</p>
          <Button asChild className="rounded-none">
            <Link href="/produtos">EXPLORAR PRODUTOS</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
