import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Instagram, Facebook } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Sobre */}
          <div>
            <h3 className="text-xs font-medium mb-6">cyga.</h3>
            <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
              Joias exclusivas que contam sua história. Criamos peças atemporais com materiais de alta qualidade e
              design único.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://instagram.com/cyga.coorp"
                target="_blank"
                className="text-muted-foreground hover:text-black"
              >
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://facebook.com" target="_blank" className="text-muted-foreground hover:text-black">
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Link>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-xs font-medium mb-6">navegação</h3>
            <ul className="space-y-3 text-xs">
              <li>
                <Link href="/produtos" className="text-muted-foreground hover:text-black">
                  produtos
                </Link>
              </li>
              <li>
                <Link href="/colecoes" className="text-muted-foreground hover:text-black">
                  coleções
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-muted-foreground hover:text-black">
                  sobre nós
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-muted-foreground hover:text-black">
                  contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Informações */}
          <div>
            <h3 className="text-xs font-medium mb-6">informações</h3>
            <ul className="space-y-3 text-xs">
              <li>
                <Link href="/termos" className="text-muted-foreground hover:text-black">
                  termos e condições
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="text-muted-foreground hover:text-black">
                  política de privacidade
                </Link>
              </li>
              <li>
                <Link href="/envio" className="text-muted-foreground hover:text-black">
                  política de envio
                </Link>
              </li>
              <li>
                <Link href="/devolucao" className="text-muted-foreground hover:text-black">
                  política de devolução
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xs font-medium mb-6">newsletter</h3>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              Inscreva-se para receber novidades, lançamentos e ofertas exclusivas.
            </p>
            <form className="space-y-3">
              <Input type="email" placeholder="Seu e-mail" className="rounded-none text-xs h-10" required />
              <Button
                type="submit"
                className="w-full rounded-none text-xs font-light h-10 bg-black text-white hover:bg-neutral-800"
              >
                inscrever
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t mt-16 pt-8 text-xs text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Cyga Joias. Todos os direitos reservados.</p>
          <div className="flex justify-center space-x-4 mt-6">
            <img src="/placeholder.svg?height=30&width=50&text=Visa" alt="Visa" className="h-6" />
            <img src="/placeholder.svg?height=30&width=50&text=Master" alt="Mastercard" className="h-6" />
            <img src="/placeholder.svg?height=30&width=50&text=Amex" alt="American Express" className="h-6" />
            <img src="/placeholder.svg?height=30&width=50&text=PayPal" alt="PayPal" className="h-6" />
            <img src="/placeholder.svg?height=30&width=50&text=Pix" alt="Pix" className="h-6" />
          </div>
        </div>
      </div>
    </footer>
  )
}
