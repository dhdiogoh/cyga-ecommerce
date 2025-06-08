"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bug, Eye, EyeOff } from "lucide-react"
import { getProdutosComFiltros, verificarEstruturaBanco } from "@/lib/services/produtos-service"

interface DebugFiltersProps {
  filters: any
  products: any[]
}

export function DebugFilters({ filters, products }: DebugFiltersProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const runDebug = async () => {
    try {
      // Verificar estrutura do banco
      const hasAtivoColumn = await verificarEstruturaBanco()

      // Buscar produtos diretamente
      const directProducts = await getProdutosComFiltros(filters)

      setDebugInfo({
        hasAtivoColumn,
        filtersApplied: filters,
        productsFromDB: directProducts.length,
        productsInState: products.length,
        sampleProducts: directProducts.slice(0, 3).map((p) => ({
          id: p.id,
          nome: p.nome,
          ativo: p.ativo,
          categoria: p.categorias?.nome,
          valor: p.valor,
          quantidade: p.quantidade,
        })),
      })
    } catch (error) {
      console.error("Erro no debug:", error)
      setDebugInfo({ error: error.message })
    }
  }

  if (!isVisible) {
    return (
      <Button variant="outline" size="sm" onClick={() => setIsVisible(true)} className="fixed bottom-4 right-4 z-50">
        <Bug className="h-4 w-4 mr-2" />
        Debug
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 max-h-96 overflow-auto z-50 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Bug className="h-4 w-4" />
            Debug Filtros
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)}>
            <EyeOff className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        <div>
          <strong>Filtros Ativos:</strong>
          <pre className="bg-muted p-2 rounded mt-1 text-xs overflow-auto">{JSON.stringify(filters, null, 2)}</pre>
        </div>

        <div>
          <strong>Produtos no Estado:</strong>
          <Badge variant="outline">{products.length}</Badge>
        </div>

        <Button size="sm" onClick={runDebug} className="w-full">
          <Eye className="h-4 w-4 mr-2" />
          Executar Debug
        </Button>

        {debugInfo && (
          <div className="space-y-2">
            {debugInfo.error ? (
              <div className="text-red-600">
                <strong>Erro:</strong> {debugInfo.error}
              </div>
            ) : (
              <>
                <div>
                  <strong>Coluna 'ativo' existe:</strong>
                  <Badge variant={debugInfo.hasAtivoColumn ? "default" : "destructive"}>
                    {debugInfo.hasAtivoColumn ? "Sim" : "Não"}
                  </Badge>
                </div>

                <div>
                  <strong>Produtos do DB:</strong>
                  <Badge variant="outline">{debugInfo.productsFromDB}</Badge>
                </div>

                <div>
                  <strong>Amostra (3 primeiros):</strong>
                  <pre className="bg-muted p-2 rounded mt-1 text-xs overflow-auto">
                    {JSON.stringify(debugInfo.sampleProducts, null, 2)}
                  </pre>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
