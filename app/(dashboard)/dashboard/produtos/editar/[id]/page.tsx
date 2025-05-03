"use client"

import { getProdutoPorId } from "@/lib/services/produtos-service"
import { ProductEditForm } from "@/components/product-edit-form"

interface ProductEditPageProps {
  params: {
    id: string
  }
}

export default async function ProductEditPage({ params }: ProductEditPageProps) {
  const produto = await getProdutoPorId(params.id)

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Editar Produto</h2>
      <ProductEditForm produto={produto} />
    </div>
  )
}
