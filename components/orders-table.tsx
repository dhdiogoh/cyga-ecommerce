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
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Eye, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { getPedidos, atualizarStatusPedido } from "@/lib/services/pedidos-service"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

export function OrdersTable() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getPedidos()
        setOrders(data)
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os pedidos",
          variant: "destructive",
        })
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [toast])

  const updateOrderStatus = async (id: string, status: string, paymentStatus: string) => {
    try {
      await atualizarStatusPedido(id, status, paymentStatus)

      // Atualizar o pedido na lista
      setOrders(
        orders.map((order) => (order.id === id ? { ...order, status, status_pagamento: paymentStatus } : order)),
      )

      toast({
        title: "Sucesso",
        description: "Status do pedido atualizado com sucesso",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do pedido",
        variant: "destructive",
      })
      console.error(error)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-4">Carregando pedidos...</div>
  }

  return (
    <>
      {/* Versão para desktop */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">#{order.id.slice(0, 8)}</TableCell>
                <TableCell>{order.clientes?.nome}</TableCell>
                <TableCell>{new Date(order.data || order.created_at).toLocaleDateString("pt-BR")}</TableCell>
                <TableCell>R$ {order.valor_total.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.status === "Entregue"
                        ? "default"
                        : order.status === "Processando"
                          ? "outline"
                          : order.status === "Enviado"
                            ? "secondary"
                            : order.status === "Pendente"
                              ? "destructive"
                              : "outline"
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.status_pagamento === "Pago"
                        ? "default"
                        : order.status_pagamento === "Aguardando"
                          ? "outline"
                          : "destructive"
                    }
                  >
                    {order.status_pagamento}
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
                        <Link href={`/dashboard/pedidos/${order.id}`} className="flex w-full items-center">
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalhes
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className="mr-2 h-4 w-4" />
                        Gerar nota fiscal
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Atualizar Status</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "Pendente", order.status_pagamento)}>
                        Pendente
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateOrderStatus(order.id, "Processando", order.status_pagamento)}
                      >
                        Processando
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "Enviado", order.status_pagamento)}>
                        Enviado
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "Entregue", order.status_pagamento)}>
                        Entregue
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateOrderStatus(order.id, "Cancelado", order.status_pagamento)}
                      >
                        Cancelado
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
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-4">
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">#{order.id.slice(0, 8)}</span>
                    <Badge
                      variant={
                        order.status === "Entregue"
                          ? "default"
                          : order.status === "Processando"
                            ? "outline"
                            : order.status === "Enviado"
                              ? "secondary"
                              : order.status === "Pendente"
                                ? "destructive"
                                : "outline"
                      }
                    >
                      {order.status}
                    </Badge>
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
                        <Link href={`/dashboard/pedidos/${order.id}`} className="flex w-full items-center">
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalhes
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className="mr-2 h-4 w-4" />
                        Gerar nota fiscal
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Atualizar Status</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "Pendente", order.status_pagamento)}>
                        Pendente
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateOrderStatus(order.id, "Processando", order.status_pagamento)}
                      >
                        Processando
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "Enviado", order.status_pagamento)}>
                        Enviado
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "Entregue", order.status_pagamento)}>
                        Entregue
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateOrderStatus(order.id, "Cancelado", order.status_pagamento)}
                      >
                        Cancelado
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <div className="text-muted-foreground">Cliente:</div>
                  <div>{order.clientes?.nome}</div>
                  <div className="text-muted-foreground">Data:</div>
                  <div>{new Date(order.data || order.created_at).toLocaleDateString("pt-BR")}</div>
                  <div className="text-muted-foreground">Total:</div>
                  <div>R$ {order.valor_total.toFixed(2)}</div>
                  <div className="text-muted-foreground">Pagamento:</div>
                  <div>
                    <Badge
                      variant={
                        order.status_pagamento === "Pago"
                          ? "default"
                          : order.status_pagamento === "Aguardando"
                            ? "outline"
                            : "destructive"
                      }
                    >
                      {order.status_pagamento}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
