"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Produto {
  id: string
  nome: string
  preco: string
  precoOriginal?: string
  imagem: string
  desconto?: number
  categoria?: string
}

interface ProductCarouselProps {
  produtos: Produto[]
}

export default function ProductCarousel({ produtos }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [visibleItems, setVisibleItems] = useState(4)

  // Simplificando os produtos para o estilo mais clean
  const produtosFormatados = produtos.map((produto) => ({
    ...produto,
    // Removendo os descontos para um visual mais clean
  }))

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleItems(1)
      } else if (window.innerWidth < 1024) {
        setVisibleItems(2)
      } else if (window.innerWidth < 1280) {
        setVisibleItems(3)
      } else {
        setVisibleItems(4)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Autoplay do carrossel
  useEffect(() => {
    const autoplayInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1
        return nextIndex >= produtosFormatados.length - visibleItems + 1 ? 0 : nextIndex
      })
    }, 10000) // 10 segundos

    // Limpar o intervalo quando o componente for desmontado
    return () => clearInterval(autoplayInterval)
  }, [produtosFormatados.length, visibleItems])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1
      return nextIndex >= produtosFormatados.length - visibleItems + 1 ? 0 : nextIndex
    })
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex - 1
      return nextIndex < 0 ? produtosFormatados.length - visibleItems : nextIndex
    })
  }

  return (
    <div className="relative max-w-[1400px] mx-auto">
      {/* Botões de navegação */}
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between z-10 px-2">
        <button
          onClick={prevSlide}
          className="w-8 h-8 flex items-center justify-center bg-white text-black rounded-full"
          aria-label="Produto anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <button
          onClick={nextSlide}
          className="w-8 h-8 flex items-center justify-center bg-white text-black rounded-full"
          aria-label="Próximo produto"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Container do carrossel */}
      <div className="overflow-hidden mx-8" ref={containerRef}>
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / visibleItems)}%)` }}
        >
          {produtosFormatados.map((produto) => (
            <div key={produto.id} className="flex-none px-1" style={{ width: `${100 / visibleItems}%` }}>
              <Link href={`/produtos/${produto.id}`} className="block">
                <div className="relative aspect-square bg-white border border-neutral-100">
                  <Image
                    src={produto.imagem || "/placeholder.svg?height=400&width=400"}
                    alt={produto.nome}
                    fill
                    className="object-contain p-6"
                  />
                </div>
                <div className="mt-3 text-left">
                  <h3 className="text-sm font-light">{produto.nome}</h3>
                  <p className="text-sm mt-1">{produto.preco}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
