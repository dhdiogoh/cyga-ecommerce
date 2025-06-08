import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductsTableEnhanced } from "@/components/products-table-enhanced"
import { PlusCircle } from "lucide-react"

export default function ProductsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Produtos</h2>
        <Link href="/dashboard/produtos/cadastro">
          <Button className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar Produto
          </Button>
        </Link>
      </div>
      <ProductsTableEnhanced />
    </div>
  )
}
