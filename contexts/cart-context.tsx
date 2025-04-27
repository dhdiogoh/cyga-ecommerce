"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { produtos } from "@/lib/produtos"

// Tipo para um item do carrinho
export interface CartItem {
  id: string
  nome: string
  preco: string
  quantidade: number
  imagem: string
}

// Interface do contexto do carrinho
interface CartContextType {
  items: CartItem[]
  addItem: (id: string, quantidade?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantidade: number) => void
  clearCart: () => void
  itemCount: number
  subtotal: string
}

// Criando o contexto
const CartContext = createContext<CartContextType | undefined>(undefined)

// Hook personalizado para usar o contexto do carrinho
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart deve ser usado dentro de um CartProvider")
  }
  return context
}

// Provedor do contexto do carrinho
export function CartProvider({ children }: { children: ReactNode }) {
  // Estado para armazenar os itens do carrinho
  const [items, setItems] = useState<CartItem[]>([])

  // Carregar o carrinho do localStorage quando o componente montar
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Erro ao carregar o carrinho:", error)
      }
    }
  }, [])

  // Salvar o carrinho no localStorage sempre que ele mudar
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  // Função para adicionar um item ao carrinho
  const addItem = (id: string, quantidade = 1) => {
    // Encontrar o produto pelo ID
    const produto = produtos.find((p) => p.id === id)
    if (!produto) return

    setItems((currentItems) => {
      // Verificar se o item já está no carrinho
      const existingItemIndex = currentItems.findIndex((item) => item.id === id)

      if (existingItemIndex >= 0) {
        // Se o item já existe, atualizar a quantidade
        const updatedItems = [...currentItems]
        updatedItems[existingItemIndex].quantidade += quantidade
        return updatedItems
      } else {
        // Se o item não existe, adicionar ao carrinho
        return [
          ...currentItems,
          {
            id,
            nome: produto.nome,
            preco: produto.preco,
            quantidade,
            imagem: produto.imagem || "/placeholder.svg",
          },
        ]
      }
    })
  }

  // Função para remover um item do carrinho
  const removeItem = (id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id))
  }

  // Função para atualizar a quantidade de um item
  const updateQuantity = (id: string, quantidade: number) => {
    if (quantidade <= 0) {
      removeItem(id)
      return
    }

    setItems((currentItems) => currentItems.map((item) => (item.id === id ? { ...item, quantidade } : item)))
  }

  // Função para limpar o carrinho
  const clearCart = () => {
    setItems([])
  }

  // Calcular o número total de itens no carrinho
  const itemCount = items.reduce((total, item) => total + item.quantidade, 0)

  // Calcular o subtotal do carrinho
  const calculateSubtotal = (): string => {
    const total = items.reduce((sum, item) => {
      const precoNumerico = Number(item.preco.replace("R$ ", "").replace(",", "."))
      return sum + precoNumerico * item.quantidade
    }, 0)

    return `R$ ${total.toFixed(2).replace(".", ",")}`
  }

  const subtotal = calculateSubtotal()

  // Valor do contexto
  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount,
    subtotal,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
