"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getProdutoPorId } from "@/lib/services/produtos-service"
import { ProductEditForm } from "@/components/product-edit-form"
import { Loader2 } from "lucide-react"

export default function ProductEditPage() {
  const params = useParams()
  const [produto, setProduto] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProduct() {
      try {
        const id = Array.isArray(params.id) ? params.id[0] : params.id
        const data = await getProdutoPorId(id)
        setProduto(data)
      } catch (err) {
        console.error("Erro ao carregar produto:", err)
        setError("Não foi possível carregar o produto")
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <p className="ml-2">Carregando produto...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 p-8 pt-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Editar Produto</h2>
      {produto && <ProductEditForm produto={produto} />}
    </div>
  )
}
