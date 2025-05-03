import { CategoriesTable } from "@/components/categories-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function CategoriesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Categorias</h2>
        <Button className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Categoria
        </Button>
      </div>
      <CategoriesTable />
    </div>
  )
}
