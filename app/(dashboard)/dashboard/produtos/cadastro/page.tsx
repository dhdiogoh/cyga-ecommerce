import { ProductForm } from "@/components/product-form"

export default function ProductRegistrationPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Cadastro de Produto</h2>
      <ProductForm />
    </div>
  )
}
