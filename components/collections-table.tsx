"use client"

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
import { MoreHorizontal } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

// Mock data for collections
const collections = [
  {
    id: "1",
    name: "Verão 2023",
    products: 15,
    active: true,
    created: "10/01/2023",
  },
  {
    id: "2",
    name: "Inverno 2023",
    products: 20,
    active: true,
    created: "15/04/2023",
  },
  {
    id: "3",
    name: "Promoções",
    products: 8,
    active: true,
    created: "05/03/2023",
  },
  {
    id: "4",
    name: "Outlet",
    products: 12,
    active: false,
    created: "20/02/2023",
  },
  {
    id: "5",
    name: "Lançamentos",
    products: 5,
    active: true,
    created: "01/07/2023",
  },
]

export function CollectionsTable() {
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
            {collections.map((collection) => (
              <TableRow key={collection.id}>
                <TableCell className="font-medium">{collection.name}</TableCell>
                <TableCell>{collection.products}</TableCell>
                <TableCell>
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${collection.active ? "bg-green-500" : "bg-red-500"}`}
                  />{" "}
                  {collection.active ? "Ativa" : "Inativa"}
                </TableCell>
                <TableCell>{collection.created}</TableCell>
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
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Ver produtos</DropdownMenuItem>
                      <DropdownMenuItem>{collection.active ? "Desativar" : "Ativar"}</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>
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
        {collections.map((collection) => (
          <Card key={collection.id}>
            <CardContent className="p-4">
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{collection.name}</span>
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${collection.active ? "bg-green-500" : "bg-red-500"}`}
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
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Ver produtos</DropdownMenuItem>
                      <DropdownMenuItem>{collection.active ? "Desativar" : "Ativar"}</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <div className="text-muted-foreground">Status:</div>
                  <div>{collection.active ? "Ativa" : "Inativa"}</div>
                  <div className="text-muted-foreground">Produtos:</div>
                  <div>{collection.products}</div>
                  <div className="text-muted-foreground">Criada em:</div>
                  <div>{collection.created}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
