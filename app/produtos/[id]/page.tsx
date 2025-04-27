"use client"

import { ToastAction } from "@/components/ui/toast"

import { produtos } from "@/lib/produtos"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Heart, Share2, Truck } from "lucide-react"
import ProductCard from "@/components/product-card"
import { useState } from "react"
import { useCart } from "@/contexts/cart-context"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"

interface ProdutoPageProps {
  params: {
    id: string
  }
}

export default function ProdutoPage({ params }: ProdutoPageProps) {
  const produto = produtos.find((p) => p.id === params.id)
  const [quantidade, setQuantidade] = useState(1)
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  if (!produto) {
    notFound()
  }

  const produtosRelacionados = produtos.filter((p) => p.id !== params.id).slice(0, 4)

  const incrementarQuantidade = () => {
    setQuantidade((prev) => prev + 1)
  }

  const decrementarQuantidade = () => {
    setQuantidade((prev) => (prev > 1 ? prev - 1 : 1))
  }

  const handleAddToCart = () => {
    setIsAdding(true)

    // Simular um pequeno atraso para feedback visual
    setTimeout(() => {
      addItem(produto.id, quantidade)
      setIsAdding(false)

      // Mostrar toast de confirmação
      toast({
        title: "Produto adicionado",
        description: `${produto.nome} foi adicionado ao carrinho.`,
        action: (
          <ToastAction altText="Ver carrinho" asChild>
            <Link href="/carrinho">Ver carrinho</Link>
          </ToastAction>
        ),
      })
    }, 300)
  }

  const handleBuyNow = () => {
    addItem(produto.id, quantidade)
    // Redirecionar para o carrinho
    window.location.href = "/carrinho"
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Imagens do Produto */}
        <div className="space-y-6">
          <div className="aspect-square relative">
            <Image src={produto.imagem || "/placeholder.svg"} alt={produto.nome} fill className="object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-square relative cursor-pointer border border-transparent hover:border-black transition-colors"
              >
                <Image
                  src={produto.imagem || "/placeholder.svg"}
                  alt={`${produto.nome} - imagem ${i}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Informações do Produto */}
        <div>
          <h1 className="text-xl font-light tracking-wider mb-2">{produto.nome}</h1>
          <p className="text-lg font-medium mb-6">{produto.preco}</p>

          <Separator className="my-8" />

          <div className="mb-8">
            <p className="text-sm leading-relaxed mb-6">{produto.descricao}</p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <span className="font-medium w-24">Material:</span>
                <span className="text-muted-foreground">{produto.material}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-24">Categoria:</span>
                <span className="text-muted-foreground">{produto.categoria}</span>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Quantidade */}
          <div className="mb-6">
            <p className="text-sm font-medium mb-2">Quantidade</p>
            <div className="flex items-center border w-32">
              <button className="px-3 py-2" onClick={decrementarQuantidade}>
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="number"
                min="1"
                value={quantidade}
                onChange={(e) => setQuantidade(Math.max(1, Number.parseInt(e.target.value) || 1))}
                className="w-full text-center border-none"
              />
              <button className="px-3 py-2" onClick={incrementarQuantidade}>
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col space-y-5">
            <Button className="rounded-none h-12 text-xs tracking-wider" onClick={handleAddToCart} disabled={isAdding}>
              {isAdding ? "ADICIONANDO AO CARRINHO..." : "ADICIONAR AO CARRINHO"}
            </Button>
            <Button variant="outline" className="rounded-none h-12 text-xs tracking-wider" onClick={handleBuyNow}>
              COMPRAR AGORA
            </Button>
            <div className="flex space-x-6 justify-center mt-2">
              <Button variant="ghost" size="sm" className="flex items-center text-xs">
                <Heart className="h-3 w-3 mr-2" />
                <span>Favoritar</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center text-xs">
                <Share2 className="h-3 w-3 mr-2" />
                <span>Compartilhar</span>
              </Button>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Entrega */}
          <div className="flex items-start space-x-2 text-sm">
            <Truck className="h-5 w-5 mt-0.5" />
            <div>
              <p className="font-medium">Entrega</p>
              <p className="text-muted-foreground">Frete grátis para compras acima de R$ 300</p>
              <p className="text-muted-foreground">Prazo de entrega: 3-5 dias úteis</p>
            </div>
          </div>
        </div>
      </div>

      {/* Descrição Detalhada */}
      <div className="mt-16">
        <h2 className="text-xl font-light mb-6 text-center">DETALHES DO PRODUTO</h2>
        <div className="max-w-3xl mx-auto">
          <p className="mb-4">
            {produto.descricaoLonga ||
              `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.`}
          </p>
          <p className="mb-4">
            Cada peça Cyga é cuidadosamente produzida à mão por artesãos experientes, garantindo qualidade excepcional e
            atenção aos detalhes.
          </p>
          <p>
            Nossas joias são embaladas em uma caixa elegante, perfeita para presente ou para guardar sua peça com
            segurança quando não estiver em uso.
          </p>
        </div>
      </div>

      {/* Produtos Relacionados */}
      <div className="mt-16">
        <h2 className="text-xl font-light mb-8 text-center">VOCÊ TAMBÉM PODE GOSTAR</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {produtosRelacionados.map((produto) => (
            <ProductCard key={produto.id} produto={produto} />
          ))}
        </div>
      </div>
    </div>
  )
}
