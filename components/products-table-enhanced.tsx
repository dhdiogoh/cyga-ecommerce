"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, MoreHorizontal, Trash, Package, Edit3 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  getProdutosComFiltros,
  excluirProduto,
  atualizarProdutosEmMassa,
  aplicarDescontoEmMassa,
  getContagemProdutos,
} from "@/lib/services/produtos-service"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ProductsFilters, type ProductFilters } from "./products-filters"
import { BulkEditDialog, type BulkUpdateData } from "./bulk-edit-dialog"

export function ProductsTableEnhanced() {
  const [products, setProducts] = useState<any[]>([])
  const [totalProductsCount, setTotalProductsCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [bulkEditDialogOpen, setBulkEditDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [filters, setFilters] = useState<ProductFilters>({})
  const { toast } = useToast()

  // Função para carregar produtos com filtros aplicados
  const loadProducts = async (currentFilters: ProductFilters = {}) => {
    try {
      setLoading(true)
      console.log("Carregando produtos com filtros:", currentFilters) // Debug log

      const data = await getProdutosComFiltros(currentFilters)
      console.log("Produtos carregados:", data.length) // Debug log

      setProducts(data)

      // Carregar contagem total apenas uma vez
      if (totalProductsCount === 0) {
        const count = await getContagemProdutos()
        setTotalProductsCount(count)
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos",
        variant: "destructive",
      })
      console.error("Erro ao carregar produtos:", error)
    } finally {
      setLoading(false)
    }
  }

  // Carregar produtos inicialmente
  useEffect(() => {
    loadProducts()
  }, [])

  // Recarregar produtos quando os filtros mudarem
  useEffect(() => {
    console.log("Filtros alterados, recarregando produtos:", filters) // Debug log
    loadProducts(filters)
    // Limpar seleção quando filtros mudarem
    setSelectedProducts([])
  }, [filters])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.map((p) => p.id))
    } else {
      setSelectedProducts([])
    }
  }

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts((prev) => [...prev, productId])
    } else {
      setSelectedProducts((prev) => prev.filter((id) => id !== productId))
    }
  }

  const confirmDelete = (id: string) => {
    setProductToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!productToDelete) return

    try {
      await excluirProduto(productToDelete)

      // Recarregar produtos do banco
      await loadProducts(filters)

      toast({
        title: "Sucesso",
        description: "Produto excluído com sucesso",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o produto",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setDeleteDialogOpen(false)
      setProductToDelete(null)
    }
  }

  const handleBulkUpdate = async (updateData: BulkUpdateData) => {
    try {
      if (updateData.action === "discount") {
        await aplicarDescontoEmMassa(selectedProducts, updateData.discountType!, updateData.discountValue!)
        toast({
          title: "Sucesso",
          description: `Desconto aplicado em ${selectedProducts.length} produto(s)`,
        })
      } else if (updateData.action === "category") {
        await atualizarProdutosEmMassa(selectedProducts, {
          categoria_id: updateData.newCategoryId,
        })
        toast({
          title: "Sucesso",
          description: `Categoria alterada em ${selectedProducts.length} produto(s)`,
        })
      } else if (updateData.action === "status") {
        // CORREÇÃO: Usar status em vez de ativo
        await atualizarProdutosEmMassa(selectedProducts, {
          status: updateData.newStatus === "ativo",
        })
        toast({
          title: "Sucesso",
          description: `Status alterado em ${selectedProducts.length} produto(s)`,
        })
      }

      // Recarregar produtos diretamente do banco com os filtros atuais
      await loadProducts(filters)
      setSelectedProducts([])
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível aplicar as alterações",
        variant: "destructive",
      })
      console.error("Erro na atualização em massa:", error)
    }
  }

  const clearFilters = () => {
    console.log("Limpando filtros") // Debug log
    setFilters({})
  }

  const handleFiltersChange = (newFilters: ProductFilters) => {
    console.log("Filtros recebidos do componente:", newFilters) // Debug log
    setFilters(newFilters)
  }

  const selectedProductsData = products.filter((p) => selectedProducts.includes(p.id))

  if (loading) {
    return <div className="flex justify-center p-4">Carregando produtos...</div>
  }

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <ProductsFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={clearFilters}
        totalProducts={totalProductsCount}
        filteredProducts={products.length}
      />

      {/* Ações em massa */}
      {selectedProducts.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <Package className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">{selectedProducts.length} produto(s) selecionado(s)</span>
          <Button size="sm" variant="outline" onClick={() => setBulkEditDialogOpen(true)} className="ml-auto">
            <Edit3 className="h-4 w-4 mr-2" />
            Editar em Massa
          </Button>
          <Button size="sm" variant="outline" onClick={() => setSelectedProducts([])}>
            Limpar Seleção
          </Button>
        </div>
      )}

      {/* Versão para desktop */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedProducts.length === products.length && products.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onCheckedChange={(checked) => handleSelectProduct(product.id, checked as boolean)}
                  />
                </TableCell>
                <TableCell className="font-medium">{product.nome}</TableCell>
                <TableCell>R$ {product.valor.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge
                    variant={product.quantidade > 10 ? "default" : product.quantidade > 0 ? "secondary" : "destructive"}
                  >
                    {product.quantidade}
                  </Badge>
                </TableCell>
                <TableCell>{product.categorias?.nome}</TableCell>
                <TableCell>
                  {/* CORREÇÃO: Usar status em vez de ativo */}
                  <Badge variant={product.status !== false ? "default" : "secondary"}>
                    {product.status !== false ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link href={`/dashboard/produtos/editar/${product.id}`} className="flex w-full items-center">
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => confirmDelete(product.id)} className="text-red-600">
                        <Trash className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Versão para mobile */}
      <div className="grid gap-4 md:hidden">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4">
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={(checked) => handleSelectProduct(product.id, checked as boolean)}
                    />
                    <h3 className="font-medium">{product.nome}</h3>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link href={`/dashboard/produtos/editar/${product.id}`} className="flex w-full items-center">
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => confirmDelete(product.id)} className="text-red-600">
                        <Trash className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <div className="text-muted-foreground">Preço:</div>
                  <div>R$ {product.valor.toFixed(2)}</div>
                  <div className="text-muted-foreground">Estoque:</div>
                  <div>
                    <Badge
                      variant={
                        product.quantidade > 10 ? "default" : product.quantidade > 0 ? "secondary" : "destructive"
                      }
                    >
                      {product.quantidade}
                    </Badge>
                  </div>
                  <div className="text-muted-foreground">Categoria:</div>
                  <div>{product.categorias?.nome}</div>
                  <div className="text-muted-foreground">Status:</div>
                  <div>
                    {/* CORREÇÃO: Usar status em vez de ativo */}
                    <Badge variant={product.status !== false ? "default" : "secondary"}>
                      {product.status !== false ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja excluir este produto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita e a imagem do produto também será removida do storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Não</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Sim
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de edição em massa */}
      <BulkEditDialog
        open={bulkEditDialogOpen}
        onOpenChange={setBulkEditDialogOpen}
        selectedProducts={selectedProductsData}
        onBulkUpdate={handleBulkUpdate}
      />
    </div>
  )
}
