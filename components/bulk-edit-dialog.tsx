"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Percent, Tag, Package } from "lucide-react"
import { getCategorias } from "@/lib/services/produtos-service"
import { toast } from "@/components/ui/use-toast"

interface BulkEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedProducts: any[]
  onBulkUpdate: (updates: BulkUpdateData) => Promise<void>
}

export interface BulkUpdateData {
  action: "discount" | "category" | "status"
  discountType?: "percentage" | "fixed"
  discountValue?: number
  newCategoryId?: number
  newStatus?: "ativo" | "inativo"
}

export function BulkEditDialog({ open, onOpenChange, selectedProducts, onBulkUpdate }: BulkEditDialogProps) {
  const [action, setAction] = useState<"discount" | "category" | "status">("discount")
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage")
  const [discountValue, setDiscountValue] = useState<number>(0)
  const [newCategoryId, setNewCategoryId] = useState<number>(0)
  const [newStatus, setNewStatus] = useState<"ativo" | "inativo">("ativo")
  const [categorias, setCategorias] = useState<{ id: number; nome: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)

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

  const handleSubmit = async () => {
    if (selectedProducts.length === 0) {
      toast({
        title: "Erro",
        description: "Nenhum produto selecionado",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const updateData: BulkUpdateData = {
        action,
        ...(action === "discount" && {
          discountType,
          discountValue,
        }),
        ...(action === "category" && {
          newCategoryId,
        }),
        ...(action === "status" && {
          newStatus,
        }),
      }

      await onBulkUpdate(updateData)
      onOpenChange(false)

      // Reset form
      setDiscountValue(0)
      setNewCategoryId(0)
      setNewStatus("ativo")
    } catch (error) {
      console.error("Erro na edição em massa:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getActionDescription = () => {
    switch (action) {
      case "discount":
        return `Aplicar desconto de ${discountValue}${discountType === "percentage" ? "%" : " reais"} em ${selectedProducts.length} produto(s)`
      case "category":
        const categoria = categorias.find((c) => c.id === newCategoryId)
        return `Alterar categoria para "${categoria?.nome || "Selecione uma categoria"}" em ${selectedProducts.length} produto(s)`
      case "status":
        return `Alterar status para "${newStatus}" em ${selectedProducts.length} produto(s)`
      default:
        return ""
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Edição em Massa
          </DialogTitle>
          <DialogDescription>
            Aplicar alterações em {selectedProducts.length} produto(s) selecionado(s)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Seleção da Ação */}
          <div className="grid gap-3">
            <Label>Tipo de Ação</Label>
            <Select value={action} onValueChange={(value: any) => setAction(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="discount">
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    Aplicar Desconto
                  </div>
                </SelectItem>
                <SelectItem value="category">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Alterar Categoria
                  </div>
                </SelectItem>
                <SelectItem value="status">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Alterar Status
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Configurações específicas por ação */}
          {action === "discount" && (
            <div className="space-y-4">
              <div className="grid gap-3">
                <Label>Tipo de Desconto</Label>
                <Select value={discountType} onValueChange={(value: any) => setDiscountType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Porcentagem (%)</SelectItem>
                    <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3">
                <Label>Valor do Desconto</Label>
                <Input
                  type="number"
                  placeholder={discountType === "percentage" ? "Ex: 20" : "Ex: 10.00"}
                  value={discountValue || ""}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  min="0"
                  max={discountType === "percentage" ? "100" : undefined}
                />
              </div>
            </div>
          )}

          {action === "category" && (
            <div className="grid gap-3">
              <Label>Nova Categoria</Label>
              <Select value={newCategoryId.toString()} onValueChange={(value) => setNewCategoryId(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria.id} value={categoria.id.toString()}>
                      {categoria.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {action === "status" && (
            <div className="grid gap-3">
              <Label>Novo Status</Label>
              <Select value={newStatus} onValueChange={(value: any) => setNewStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Preview da ação */}
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm font-medium">Preview da ação:</p>
            <p className="text-sm text-muted-foreground mt-1">{getActionDescription()}</p>
          </div>

          {/* Lista de produtos selecionados */}
          <div className="max-h-32 overflow-y-auto">
            <Label className="text-sm font-medium">Produtos selecionados:</Label>
            <div className="mt-2 space-y-1">
              {selectedProducts.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between text-sm">
                  <span className="truncate">{product.nome}</span>
                  <Badge variant="outline">R$ {product.valor.toFixed(2)}</Badge>
                </div>
              ))}
              {selectedProducts.length > 5 && (
                <p className="text-xs text-muted-foreground">... e mais {selectedProducts.length - 5} produto(s)</p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Aplicando...
              </>
            ) : (
              "Aplicar Alterações"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
