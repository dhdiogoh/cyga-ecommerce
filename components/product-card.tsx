"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

interface Produto {
  id: string
  nome: string
  preco: string
  imagem: string
  categoria?: string
  material?: string
  descricao?: string
  descricaoLonga?: string
}

interface ProductCardProps {
  produto: Produto
  largeImage?: boolean
}

export default function ProductCard({ produto, largeImage = false }: ProductCardProps) {
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsAdding(true)

    // Simular um pequeno atraso para feedback visual
    setTimeout(() => {
      addItem(produto.id, 1)
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

  return (
    <div className="group">
      <div className={`relative overflow-hidden mb-3 ${largeImage ? "aspect-[4/5]" : "aspect-square"}`}>
        <Link href={`/produtos/${produto.id}`}>
          <Image
            src={produto.imagem || "/placeholder.svg"}
            alt={produto.nome}
            fill
            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${largeImage ? "object-contain p-2" : ""}`}
          />
        </Link>
        <div className="absolute inset-x-0 bottom-0 bg-white bg-opacity-95 py-3 px-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Button
            variant="default"
            size="sm"
            className="w-full rounded-none text-xs font-light bg-black text-white hover:bg-neutral-800"
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            {isAdding ? "ADICIONANDO..." : "ADICIONAR AO CARRINHO"}
          </Button>
        </div>
      </div>
      <div className="text-center">
        <Link href={`/produtos/${produto.id}`} className="block">
          <h3 className={`text-sm font-light ${largeImage ? "text-base" : ""}`}>{produto.nome}</h3>
          <p className={`text-sm font-normal mt-1 ${largeImage ? "text-base" : ""}`}>{produto.preco}</p>
        </Link>
      </div>
    </div>
  )
}
