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
import { MoreHorizontal, User, Edit, Trash } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { getClientes, excluirCliente } from "@/lib/services/clientes-service"
import { useToast } from "@/components/ui/use-toast"

export function CustomersTable() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function loadCustomers() {
      try {
        const data = await getClientes()
        setCustomers(data)
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os clientes",
          variant: "destructive",
        })
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadCustomers()
  }, [toast])

  const handleDelete = async (id: string) => {
    try {
      await excluirCliente(id)
      setCustomers(customers.filter((customer) => customer.id !== id))
      toast({
        title: "Sucesso",
        description: "Cliente excluído com sucesso",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o cliente",
        variant: "destructive",
      })
      console.error(error)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-4">Carregando clientes...</div>
  }

  return (
    <>
      {/* Versão para desktop */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Pedidos</TableHead>
              <TableHead>Total Gasto</TableHead>
              <TableHead>Último Pedido</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={`/avatars/${customer.id}.png`} alt={customer.nome} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{customer.nome}</span>
                  </div>
                </TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.pedidos_count || 0}</TableCell>
                <TableCell>R$ {customer.total_gasto?.toFixed(2) || "0.00"}</TableCell>
                <TableCell>{customer.ultimo_pedido || "N/A"}</TableCell>
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
                        Editar cliente
                      </DropdownMenuItem>
                      <DropdownMenuItem>Ver pedidos</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(customer.id)} className="text-red-600">
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
        {customers.map((customer) => (
          <Card key={customer.id}>
            <CardContent className="p-4">
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={`/avatars/${customer.id}.png`} alt={customer.nome} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{customer.nome}</span>
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
                        Editar cliente
                      </DropdownMenuItem>
                      <DropdownMenuItem>Ver pedidos</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(customer.id)} className="text-red-600">
                        <Trash className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <div className="text-muted-foreground">Email:</div>
                  <div className="truncate">{customer.email}</div>
                  <div className="text-muted-foreground">Pedidos:</div>
                  <div>{customer.pedidos_count || 0}</div>
                  <div className="text-muted-foreground">Total Gasto:</div>
                  <div>R$ {customer.total_gasto?.toFixed(2) || "0.00"}</div>
                  <div className="text-muted-foreground">Último Pedido:</div>
                  <div>{customer.ultimo_pedido || "N/A"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
