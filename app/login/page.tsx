import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-3xl font-light text-center mb-8">MINHA CONTA</h1>

      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="cadastro">Cadastro</TabsTrigger>
        </TabsList>

        {/* Login */}
        <TabsContent value="login">
          <div className="border p-6">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email_login">E-mail</Label>
                <Input id="email_login" type="email" placeholder="seu@email.com" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="senha_login">Senha</Label>
                  <Link href="/recuperar-senha" className="text-sm underline">
                    Esqueceu a senha?
                  </Link>
                </div>
                <Input id="senha_login" type="password" required />
              </div>
              <Button type="submit" className="w-full rounded-none">
                ENTRAR
              </Button>
            </form>
          </div>
        </TabsContent>

        {/* Cadastro */}
        <TabsContent value="cadastro">
          <div className="border p-6">
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome_cadastro">Nome</Label>
                  <Input id="nome_cadastro" placeholder="Seu nome" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sobrenome_cadastro">Sobrenome</Label>
                  <Input id="sobrenome_cadastro" placeholder="Seu sobrenome" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email_cadastro">E-mail</Label>
                <Input id="email_cadastro" type="email" placeholder="seu@email.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf_cadastro">CPF</Label>
                <Input id="cpf_cadastro" placeholder="000.000.000-00" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone_cadastro">Telefone</Label>
                <Input id="telefone_cadastro" placeholder="(00) 00000-0000" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senha_cadastro">Senha</Label>
                <Input id="senha_cadastro" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmar_senha">Confirmar Senha</Label>
                <Input id="confirmar_senha" type="password" required />
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="termos" className="rounded" required />
                <label htmlFor="termos" className="text-sm">
                  Li e concordo com os{" "}
                  <Link href="/termos" className="underline">
                    Termos de Serviço
                  </Link>{" "}
                  e{" "}
                  <Link href="/privacidade" className="underline">
                    Política de Privacidade
                  </Link>
                </label>
              </div>
              <Button type="submit" className="w-full rounded-none">
                CRIAR CONTA
              </Button>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
