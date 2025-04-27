import { produtos } from "@/lib/produtos"
import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function NovidadesPage() {
  // Simulando produtos novos (últimos 6 produtos)
  const produtosNovos = produtos.slice(0, 6)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[50vh] w-full">
        <Image
          src="/placeholder.svg?height=800&width=1600"
          alt="Novidades CYGA"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
          <h1 className="text-4xl md:text-6xl font-light mb-4">NOVIDADES</h1>
          <p className="text-xl md:text-2xl font-light max-w-2xl">
            Descubra nossas mais recentes criações e tendências
          </p>
        </div>
      </section>

      {/* Produtos Novos */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-xl font-light text-center mb-12">LANÇAMENTOS RECENTES</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {produtosNovos.map((produto) => (
            <ProductCard key={produto.id} produto={produto} largeImage={true} />
          ))}
        </div>
      </section>

      {/* Banner Coleção */}
      <section className="relative py-20 px-4 md:px-8 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-light mb-6">Nova Coleção Primavera</h2>
              <p className="mb-8 text-lg">
                Nossa nova coleção traz peças delicadas inspiradas nas flores e cores da primavera. Cada item foi
                cuidadosamente selecionado para trazer frescor e elegância ao seu visual.
              </p>
              <Button className="rounded-none">EXPLORAR COLEÇÃO</Button>
            </div>
            <div className="relative h-[400px]">
              <Image
                src="/placeholder.svg?height=600&width=500"
                alt="Nova Coleção Primavera"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tendências */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-xl font-light text-center mb-12">TENDÊNCIAS DA ESTAÇÃO</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="relative h-80 mb-4">
              <Image src="/placeholder.svg?height=500&width=400" alt="Minimalismo" fill className="object-cover" />
            </div>
            <h3 className="text-xl font-light mb-2">Minimalismo</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Peças simples e elegantes que combinam com qualquer look
            </p>
          </div>
          <div className="text-center">
            <div className="relative h-80 mb-4">
              <Image src="/placeholder.svg?height=500&width=400" alt="Peças Statement" fill className="object-cover" />
            </div>
            <h3 className="text-xl font-light mb-2">Peças Statement</h3>
            <p className="text-sm text-muted-foreground mb-4">Acessórios marcantes que transformam qualquer produção</p>
          </div>
          <div className="text-center">
            <div className="relative h-80 mb-4">
              <Image src="/placeholder.svg?height=500&width=400" alt="Mix de Texturas" fill className="object-cover" />
            </div>
            <h3 className="text-xl font-light mb-2">Mix de Texturas</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Combinações de materiais que trazem personalidade às peças
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
