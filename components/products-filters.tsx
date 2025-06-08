"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Filter, RotateCcw } from "lucide-react"
import { getCategorias } from "@/lib/services/produtos-service"

export interface ProductFilters {
  categoria_id?: number
  preco_min?: number
  preco_max?: number
  estoque_min?: number
  estoque_max?: number
  status?: "ativo" | "inativo"
  data_inicio?: string
  data_fim?: string
  busca?: string
}

interface ProductsFiltersProps {
  filters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
  onClearFilters: () => void
  totalProducts: number
  filteredProducts: number
}

export function ProductsFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  totalProducts,
  filteredProducts,
}: ProductsFiltersProps) {
  const [categorias, setCategorias] = useState<{ id: number; nome: string }[]>([])
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    async function loadCategorias() {
      try {
        const data = await getCategorias()
        setCategorias(data)
      } catch (error) {
        console.error("Erro ao carregar categorias:", error)
      }
    }
    loadCategorias()
  }, [])

  // Corrigir a função updateFilter para garantir que os valores sejam tratados corretamente
  const updateFilter = (key: keyof ProductFilters, value: any) => {
    console.log(`Atualizando filtro ${key}:`, value) // Debug log

    // Tratar valores especiais
    let processedValue = value

    if (value === "all" || value === "") {
      processedValue = undefined
    } else if (key === "categoria_id" && value) {
      processedValue = Number(value)
    } else if (
      (key === "preco_min" || key === "preco_max" || key === "estoque_min" || key === "estoque_max") &&
      value
    ) {
      processedValue = Number(value)
    }

    const newFilters = {
      ...filters,
      [key]: processedValue,
    }

    console.log("Novos filtros:", newFilters) // Debug log
    onFiltersChange(newFilters)
  }

  const hasActiveFilters = Object.values(filters).some((value) => value !== undefined && value !== "")

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter((value) => value !== undefined && value !== "").length
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <CardTitle className="text-lg">Filtros</CardTitle>
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()} ativo{getActiveFiltersCount() > 1 ? "s" : ""}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {filteredProducts} de {totalProducts} produtos
            </span>
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? "Recolher" : "Expandir"}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Busca */}
          <div className="grid gap-2">
            <Label htmlFor="busca">Buscar produto</Label>
            <Input
              id="busca"
              placeholder="Nome do produto..."
              value={filters.busca || ""}
              onChange={(e) => updateFilter("busca", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Categoria */}
            <div className="grid gap-2">
              <Label>Categoria</Label>
              {/* Corrigir o Select de categoria para garantir que o valor "all" seja tratado corretamente */}
              <Select
                value={filters.categoria_id?.toString() || "all"}
                onValueChange={(value) => updateFilter("categoria_id", value === "all" ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria.id} value={categoria.id.toString()}>
                      {categoria.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="grid gap-2">
              <Label>Status</Label>
              {/* Corrigir o Select de status */}
              <Select
                value={filters.status || "all"}
                onValueChange={(value) => updateFilter("status", value === "all" ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Faixa de Preço */}
            <div className="grid gap-2">
              <Label>Preço Mínimo</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={filters.preco_min || ""}
                onChange={(e) => updateFilter("preco_min", e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>

            <div className="grid gap-2">
              <Label>Preço Máximo</Label>
              <Input
                type="number"
                placeholder="999.99"
                value={filters.preco_max || ""}
                onChange={(e) => updateFilter("preco_max", e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Estoque */}
            <div className="grid gap-2">
              <Label>Estoque Mínimo</Label>
              <Input
                type="number"
                placeholder="0"
                value={filters.estoque_min || ""}
                onChange={(e) => updateFilter("estoque_min", e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>

            <div className="grid gap-2">
              <Label>Estoque Máximo</Label>
              <Input
                type="number"
                placeholder="999"
                value={filters.estoque_max || ""}
                onChange={(e) => updateFilter("estoque_max", e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>

            {/* Data de Criação */}
            <div className="grid gap-2">
              <Label>Data Início</Label>
              <Input
                type="date"
                value={filters.data_inicio || ""}
                onChange={(e) => updateFilter("data_inicio", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label>Data Fim</Label>
              <Input
                type="date"
                value={filters.data_fim || ""}
                onChange={(e) => updateFilter("data_fim", e.target.value)}
              />
            </div>
          </div>

          {/* Botão para limpar filtros */}
          {hasActiveFilters && (
            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={onClearFilters}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Limpar Filtros
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
