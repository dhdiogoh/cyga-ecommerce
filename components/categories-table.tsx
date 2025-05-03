"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { getCategorias, excluirCategoria } from "@/lib/services/categorias-service"
import { useToast } from "@/components/ui/use-toast"

export function CategoriesTable() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategorias()
        setCategories(data)
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar as categorias",
          variant: "destructive",
        })
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [toast])

  const handleDelete = async (id: string) => {
    try {
      await excluirCategoria(id)
      setCategories(categories.filter((category) => category.id !== id))
      toast({
        title: "Sucesso",
        description: "Categoria excluída com sucesso",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a categoria",
        variant: "destructive",
      })
      console.error(error)
    }
  }

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    // Implementar a lógica para atualizar o status da categoria
  }

  if (loading) {
    return <div className="flex justify-center p-4">Carregando categorias...</div>
  }

  return (
    <>
      {/* Versão para desktop */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Produtos</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criada em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.nome}</TableCell>
                <TableCell>{category.produtos_count || 0}</TableCell>
                <TableCell>
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${category.ativa ? "bg-green-500" : "bg-red-500"}`}
                  />{" "}
                  {category.ativa ? "Ativa" : "Inativa"}
                </TableCell>
                <TableCell>{new Date(category.created_at).toLocaleDateString("pt-BR")}</TableCell>
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
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleStatus(category.id, category.ativa)}>
                        {category.ativa ? "Desativar" : "Ativar"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(category.id)} className="text-red-600">
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
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="p-4">
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{category.nome}</span>
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${category.ativa ? "bg-green-500" : "bg-red-500"}`}
                    />
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
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleStatus(category.id, category.ativa)}>
                        {category.ativa ? "Desativar" : "Ativar"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(category.id)} className="text-red-600">
                        <Trash className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <div className="text-muted-foreground">Status:</div>
                  <div>{category.ativa ? "Ativa" : "Inativa"}</div>
                  <div className="text-muted-foreground">Produtos:</div>
                  <div>{category.produtos_count || 0}</div>
                  <div className="text-muted-foreground">Criada em:</div>
                  <div>{new Date(category.created_at).toLocaleDateString("pt-BR")}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
