import { produtos } from "@/lib/produtos"
import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function ForMenPage() {
  // Simulando produtos masculinos (usando alguns produtos existentes)
  const produtosMasculinos = produtos.slice(2, 8)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full">
        <Image src="/placeholder.svg?height=800&width=1600" alt="CYGA For Men" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
          <h1 className="text-4xl md:text-6xl font-light mb-4">CYGA FOR MEN</h1>
          <p className="text-xl md:text-2xl font-light max-w-2xl">
            Acessórios masculinos que combinam elegância e personalidade
          </p>
        </div>
      </section>

      {/* Categorias */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-xl font-light text-center mb-12">CATEGORIAS</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="relative h-80 group">
            <Image
              src="/placeholder.svg?height=500&width=400&text=Pulseiras"
              alt="Pulseiras Masculinas"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Button asChild variant="outline" className="rounded-none text-white border-white hover:bg-black/20">
                <Link href="/produtos/pulseiras">VER PULSEIRAS</Link>
              </Button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-white py-3 text-center">
              <h3 className="text-lg font-light">Pulseiras</h3>
            </div>
          </div>
          <div className="relative h-80 group">
            <Image
              src="/placeholder.svg?height=500&width=400&text=Colares"
              alt="Colares Masculinos"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Button asChild variant="outline" className="rounded-none text-white border-white hover:bg-black/20">
                <Link href="/produtos/colares">VER COLARES</Link>
              </Button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-white py-3 text-center">
              <h3 className="text-lg font-light">Colares</h3>
            </div>
          </div>
          <div className="relative h-80 group">
            <Image
              src="/placeholder.svg?height=500&width=400&text=Anéis"
              alt="Anéis Masculinos"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Button asChild variant="outline" className="rounded-none text-white border-white hover:bg-black/20">
                <Link href="/produtos/aneis">VER ANÉIS</Link>
              </Button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-white py-3 text-center">
              <h3 className="text-lg font-light">Anéis</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Produtos em Destaque */}
      <section className="py-16 px-4 md:px-8 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-light text-center mb-12">DESTAQUES MASCULINOS</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {produtosMasculinos.map((produto) => (
              <ProductCard key={produto.id} produto={produto} />
            ))}
          </div>
          <div className="flex justify-center mt-12">
            <Button asChild className="rounded-none">
              <Link href="/produtos">VER TODOS OS PRODUTOS</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Estilo */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-xl font-light text-center mb-12">ESTILO & PERSONALIDADE</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h3 className="text-2xl font-light mb-4">Acessórios que Refletem Quem Você É</h3>
            <p className="mb-6">
              Na CYGA, acreditamos que os acessórios masculinos são mais do que simples complementos – são expressões da
              sua personalidade e estilo único.
            </p>
            <p className="mb-6">
              Nossas peças masculinas são cuidadosamente selecionadas para combinar elegância atemporal com design
              contemporâneo, permitindo que você expresse sua individualidade em cada detalhe.
            </p>
            <Button asChild className="rounded-none">
              <Link href="/produtos">EXPLORAR COLEÇÃO</Link>
            </Button>
          </div>
          <div className="relative h-[400px] order-1 md:order-2">
            <Image src="/placeholder.svg?height=600&width=500" alt="Estilo Masculino" fill className="object-cover" />
          </div>
        </div>
      </section>
    </div>
  )
}
