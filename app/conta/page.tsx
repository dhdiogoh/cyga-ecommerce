import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function ContaPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-light text-center mb-12">MINHA CONTA</h1>

      <Tabs defaultValue="pedidos" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
          <TabsTrigger value="dados">Meus Dados</TabsTrigger>
          <TabsTrigger value="enderecos">Endereços</TabsTrigger>
          <TabsTrigger value="favoritos">Favoritos</TabsTrigger>
        </TabsList>

        {/* Pedidos */}
        <TabsContent value="pedidos">
          <div className="space-y-6">
            <div className="border p-6">
              <div className="flex flex-col md:flex-row justify-between mb-4">
                <div>
                  <h3 className="font-medium">Pedido #12345</h3>
                  <p className="text-sm text-muted-foreground">Realizado em 15/04/2023</p>
                </div>
                <div className="mt-2 md:mt-0">
                  <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Entregue</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between text-sm mb-4">
                <span>2 produtos</span>
                <span className="font-medium">Total: R$ 699,60</span>
              </div>

              <div className="flex justify-between">
                <Button asChild variant="outline" size="sm" className="rounded-none">
                  <Link href="#">Ver Detalhes</Link>
                </Button>
                <Button size="sm" className="rounded-none">
                  Comprar Novamente
                </Button>
              </div>
            </div>

            <div className="border p-6">
              <div className="flex flex-col md:flex-row justify-between mb-4">
                <div>
                  <h3 className="font-medium">Pedido #12289</h3>
                  <p className="text-sm text-muted-foreground">Realizado em 02/03/2023</p>
                </div>
                <div className="mt-2 md:mt-0">
                  <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Entregue</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between text-sm mb-4">
                <span>1 produto</span>
                <span className="font-medium">Total: R$ 459,90</span>
              </div>

              <div className="flex justify-between">
                <Button asChild variant="outline" size="sm" className="rounded-none">
                  <Link href="#">Ver Detalhes</Link>
                </Button>
                <Button size="sm" className="rounded-none">
                  Comprar Novamente
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Meus Dados */}
        <TabsContent value="dados">
          <div className="border p-6">
            <h2 className="text-xl font-light mb-6">Informações Pessoais</h2>

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input id="nome" defaultValue="Maria" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sobrenome">Sobrenome</Label>
                  <Input id="sobrenome" defaultValue="Silva" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" defaultValue="maria.silva@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" defaultValue="(11) 98765-4321" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input id="cpf" defaultValue="123.456.789-00" />
                </div>
              </div>

              <Separator className="my-6" />

              <h3 className="text-lg font-light mb-4">Alterar Senha</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="senha_atual">Senha Atual</Label>
                  <Input id="senha_atual" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nova_senha">Nova Senha</Label>
                  <Input id="nova_senha" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmar_senha">Confirmar Nova Senha</Label>
                  <Input id="confirmar_senha" type="password" />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button className="rounded-none">SALVAR ALTERAÇÕES</Button>
              </div>
            </form>
          </div>
        </TabsContent>

        {/* Endereços */}
        <TabsContent value="enderecos">
          <div className="space-y-6">
            <div className="flex justify-end">
              <Button className="rounded-none">ADICIONAR NOVO ENDEREÇO</Button>
            </div>

            <div className="border p-6">
              <div className="flex justify-between mb-4">
                <h3 className="font-medium">Endereço Principal</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="rounded-none">
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-none text-red-500">
                    Remover
                  </Button>
                </div>
              </div>

              <div className="text-sm space-y-1">
                <p>Maria Silva</p>
                <p>Rua das Flores, 123 - Apto 45</p>
                <p>Jardim Primavera</p>
                <p>São Paulo - SP</p>
                <p>CEP: 01234-567</p>
                <p>Telefone: (11) 98765-4321</p>
              </div>
            </div>

            <div className="border p-6">
              <div className="flex justify-between mb-4">
                <h3 className="font-medium">Endereço de Trabalho</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="rounded-none">
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-none text-red-500">
                    Remover
                  </Button>
                </div>
              </div>

              <div className="text-sm space-y-1">
                <p>Maria Silva</p>
                <p>Av. Paulista, 1000 - Sala 1010</p>
                <p>Bela Vista</p>
                <p>São Paulo - SP</p>
                <p>CEP: 01310-100</p>
                <p>Telefone: (11) 3456-7890</p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Favoritos */}
        <TabsContent value="favoritos">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="border group">
                <div className="relative aspect-square">
                  <Image
                    src="/placeholder.svg?height=300&width=300"
                    alt={`Produto Favorito ${item}`}
                    fill
                    className="object-cover"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white"
                  >
                    <span className="sr-only">Remover dos favoritos</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 text-red-500"
                    >
                      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </svg>
                  </Button>
                </div>
                <div className="p-4">
                  <h3 className="font-medium">Produto Favorito {item}</h3>
                  <p className="text-sm text-muted-foreground mb-2">Categoria</p>
                  <p className="font-medium mb-4">R$ 299,90</p>
                  <Button className="w-full rounded-none">ADICIONAR AO CARRINHO</Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
