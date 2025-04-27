import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import ProductCard from "@/components/product-card"
import { produtos } from "@/lib/produtos"
import ProductCarousel from "@/components/product-carousel"
import InstagramFeed from "@/components/instagram-feed"

export default function Home() {
  const produtosDestaque = produtos.slice(0, 8) // Aumentando para 8 produtos para ter mais opções no carrossel
  const novaColecao = produtos.slice(4, 8)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[90vh] w-full">
        <Image src="/placeholder.svg?height=1080&width=1920" alt="Cyga Joias" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
          <h1 className="text-5xl md:text-7xl font-light mb-6">cyga.</h1>
          <p className="text-base md:text-xl font-light mb-10 max-w-xl">joias exclusivas que contam sua história</p>
          <Button
            asChild
            size="lg"
            className="rounded-none bg-white text-black hover:bg-white/90 px-10 text-xs font-light"
          >
            <Link href="/produtos">explorar coleção</Link>
          </Button>
        </div>
      </section>

      {/* Produtos em Destaque - Carrossel */}
      <section className="py-20 px-0 md:px-4">
        <h2 className="text-xl font-light text-center mb-16">produtos em destaque</h2>
        <ProductCarousel produtos={produtosDestaque} />
        <div className="flex justify-center mt-16">
          <Button asChild variant="outline" className="rounded-none text-xs font-light px-8">
            <Link href="/produtos">ver todos os produtos</Link>
          </Button>
        </div>
      </section>

      {/* Banner */}
      <section className="relative h-[60vh] w-full bg-neutral-100">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          <div className="flex flex-col justify-center items-center p-8 text-center md:text-left md:items-start">
            <h2 className="text-3xl font-light mb-4">lançamento</h2>
            <p className="mb-8 max-w-md font-light">
              Descubra nossa nova coleção de joias exclusivas, desenhadas para mulheres que valorizam elegância e
              autenticidade.
            </p>
            <Button asChild className="rounded-none text-xs font-light bg-black text-white hover:bg-neutral-800">
              <Link href="/lancamentos">conhecer agora</Link>
            </Button>
          </div>
          <div className="relative hidden md:block">
            <Image src="/placeholder.svg?height=800&width=600" alt="Nova Coleção" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* Lançamento */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-xl font-light text-center mb-12">lançamento</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {novaColecao.map((produto) => (
            <div key={produto.id} className="flex justify-center">
              <div className="w-full max-w-md">
                <ProductCard produto={produto} largeImage={true} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sobre Nós */}
      <section className="py-16 px-4 md:px-8 bg-neutral-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-light mb-6">sobre a cyga</h2>
          <p className="mb-8 font-light">
            A Cyga nasceu da paixão por criar joias que transcendem o tempo. Cada peça é cuidadosamente desenhada e
            produzida com materiais de alta qualidade, respeitando práticas sustentáveis e éticas.
          </p>
          <Button
            asChild
            variant="outline"
            className="rounded-none text-xs font-light border-black hover:bg-neutral-100"
          >
            <Link href="/sobre">conheça nossa história</Link>
          </Button>
        </div>
      </section>

      {/* Instagram Feed - Agora usando o componente InstagramFeed */}
      <InstagramFeed />
    </div>
  )
}
