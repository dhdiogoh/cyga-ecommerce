import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function SobrePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full">
        <Image src="/placeholder.svg?height=800&width=1600" alt="Sobre a Cyga" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
          <h1 className="text-4xl md:text-6xl font-light mb-4">NOSSA HISTÓRIA</h1>
          <p className="text-xl md:text-2xl font-light max-w-2xl">Criando joias que contam histórias desde 2015</p>
        </div>
      </section>

      {/* Nossa História */}
      <section className="py-16 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-light mb-6">NOSSA HISTÓRIA</h2>
          <p className="text-lg leading-relaxed mb-6">
            A CYGA é muito mais do que uma loja de semijoias e acessórios. Ela é o resultado de uma trajetória que teve
            início no coração de Deus e se materializou através da união das sócias e fundadoras, Cynthia e Gabi.
          </p>
          <p className="text-lg leading-relaxed">
            Depois de enfrentarem altos e baixos em sua jornada juntas, encontraram solidez e propósito em Jesus,
            fazendo com que todos os aspectos de suas vidas, inclusive o negócio que criaram, fossem submetidos ao
            Senhor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl font-light mb-4">NOSSA MISSÃO</h3>
            <p className="mb-4">
              Através da CYGA, temos a missão de proporcionar aos nossos clientes muito mais do que produtos, mas sim
              momentos de encanto e beleza, que ressaltam a singularidade e a elegância de cada pessoa.
            </p>
            <p>
              CYGA é uma loja que valoriza a essência e a personalidade de cada indivíduo. Cada peça é escolhida com
              carinho, refletindo tendências para valorizar as suas produções.
            </p>
          </div>
          <div className="relative h-80">
            <Image src="/placeholder.svg?height=600&width=500" alt="Nossa Missão" fill className="object-cover" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative h-80 order-2 md:order-1">
            <Image src="/placeholder.svg?height=600&width=500" alt="Nossas Fundadoras" fill className="object-cover" />
          </div>
          <div className="order-1 md:order-2">
            <h3 className="text-2xl font-light mb-4">NOSSAS FUNDADORAS</h3>
            <p className="mb-4">
              Cynthia e Gabi uniram suas iniciais para dar vida à CYGA. Mais que sócias, são amigas que compartilham não
              apenas um negócio, mas uma fé e propósito em comum.
            </p>
            <p>
              A jornada das fundadoras é marcada por desafios e superações, sempre guiadas pela fé em Jesus Cristo, que
              se tornou o alicerce de todas as decisões relacionadas à marca.
            </p>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-light mb-4">NOSSOS VALORES</h3>
          <p className="mb-6">
            Fundamentamos nosso trabalho em valores cristãos, buscando excelência em cada detalhe. Acreditamos que cada
            peça que criamos deve não apenas embelezar, mas também transmitir significado e propósito.
          </p>
          <p className="mb-6">
            Valorizamos relacionamentos autênticos com nossos clientes, fornecedores e colaboradores, sempre pautados
            pela integridade, respeito e amor ao próximo.
          </p>
          <Button asChild className="rounded-none">
            <Link href="/produtos">EXPLORAR COLEÇÕES</Link>
          </Button>
        </div>
      </section>

      {/* Equipe */}
      <section className="py-16 px-4 md:px-8 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-light text-center mb-12">NOSSAS FUNDADORAS</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
            <div className="text-center">
              <div className="relative h-80 mb-4 mx-auto">
                <Image
                  src="/placeholder.svg?height=400&width=400"
                  alt="Cynthia - Fundadora"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-medium">Cynthia</h3>
              <p className="text-muted-foreground mb-2">Co-Fundadora</p>
              <p className="text-sm">
                Com paixão por design e beleza, Cynthia traz sua criatividade e visão para cada coleção da CYGA, sempre
                buscando peças que transmitam significado.
              </p>
            </div>

            <div className="text-center">
              <div className="relative h-80 mb-4 mx-auto">
                <Image
                  src="/placeholder.svg?height=400&width=400"
                  alt="Gabi - Fundadora"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-medium">Gabi</h3>
              <p className="text-muted-foreground mb-2">Co-Fundadora</p>
              <p className="text-sm">
                Com um olhar atento para tendências e qualidade, Gabi garante que cada peça da CYGA seja escolhida com
                carinho para valorizar a singularidade de cada cliente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contato */}
      <section className="py-16 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-light mb-4">ENTRE EM CONTATO</h2>
          <p className="mb-6">
            Estamos sempre à disposição para responder suas dúvidas, ouvir sugestões ou ajudar com qualquer questão.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-light mb-4">INFORMAÇÕES DE CONTATO</h3>
            <div className="space-y-4">
              <p>
                <strong>Endereço:</strong>
                <br />
                Rua das Joias, 123
                <br />
                Jardim Elegance
                <br />
                São Paulo - SP, 01234-567
              </p>
              <p>
                <strong>E-mail:</strong>
                <br />
                contato@cygajoias.com.br
              </p>
              <p>
                <strong>Telefone:</strong>
                <br />
                (11) 1234-5678
              </p>
              <p>
                <strong>Horário de Atendimento:</strong>
                <br />
                Segunda a Sexta: 9h às 18h
                <br />
                Sábado: 10h às 14h
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-light mb-4">ENVIE UMA MENSAGEM</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome_contato">Nome</Label>
                  <Input id="nome_contato" placeholder="Seu nome" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email_contato">E-mail</Label>
                  <Input id="email_contato" type="email" placeholder="seu@email.com" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assunto">Assunto</Label>
                <Input id="assunto" placeholder="Assunto da mensagem" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mensagem">Mensagem</Label>
                <textarea
                  id="mensagem"
                  rows={5}
                  className="w-full border rounded-md p-2"
                  placeholder="Sua mensagem"
                  required
                ></textarea>
              </div>
              <Button type="submit" className="rounded-none">
                ENVIAR MENSAGEM
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
