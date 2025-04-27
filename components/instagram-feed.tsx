"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Instagram } from "lucide-react"

interface InstagramPost {
  id: string
  media_url: string
  permalink: string
  caption?: string
}

// Dados de exemplo para usar enquanto a API não está configurada
const EXAMPLE_POSTS: InstagramPost[] = [
  {
    id: "1",
    media_url: "/images/produtos/brinco-diamante.png",
    permalink: "https://instagram.com/cyga.coorp",
    caption: "Brincos de diamante trio",
  },
  {
    id: "2",
    media_url: "/images/produtos/colar-v-prata.png",
    permalink: "https://instagram.com/cyga.coorp",
    caption: "Colar pingente V em prata",
  },
  {
    id: "3",
    media_url: "/images/produtos/brinco-coracao.png",
    permalink: "https://instagram.com/cyga.coorp",
    caption: "Brincos coração dourado",
  },
  {
    id: "4",
    media_url: "/images/produtos/brinco-barra-ouro.png",
    permalink: "https://instagram.com/cyga.coorp",
    caption: "Brincos barras douradas",
  },
  {
    id: "5",
    media_url: "/images/produtos/brinco-barra-prata.png",
    permalink: "https://instagram.com/cyga.coorp",
    caption: "Brincos barras prateadas",
  },
  {
    id: "6",
    media_url: "/images/produtos/brinco-argola-ouro.png",
    permalink: "https://instagram.com/cyga.coorp",
    caption: "Brinco argola trançada",
  },
  {
    id: "7",
    media_url: "/images/produtos/colar-v-diamante.png",
    permalink: "https://instagram.com/cyga.coorp",
    caption: "Colar V cravejado",
  },
  {
    id: "8",
    media_url: "/images/produtos/colar-duplo-ouro.png",
    permalink: "https://instagram.com/cyga.coorp",
    caption: "Colar duplo dourado",
  },
]

export default function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingExampleData, setUsingExampleData] = useState(false)

  useEffect(() => {
    async function fetchInstagramPosts() {
      try {
        setLoading(true)
        const response = await fetch("/api/instagram")

        if (!response.ok) {
          // Se a API retornar erro, usar dados de exemplo
          console.log("Usando dados de exemplo para o feed do Instagram")
          setPosts(EXAMPLE_POSTS)
          setUsingExampleData(true)
          return
        }

        const data = await response.json()
        setPosts(data)
      } catch (err) {
        console.error("Erro ao buscar posts do Instagram:", err)
        // Usar dados de exemplo em caso de erro
        setPosts(EXAMPLE_POSTS)
        setUsingExampleData(true)
      } finally {
        setLoading(false)
      }
    }

    fetchInstagramPosts()
  }, [])

  // Renderizar placeholders enquanto carrega
  if (loading) {
    return (
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-xl font-light text-center mb-12">@cyga.coorp</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="aspect-square bg-gray-100 animate-pulse" />
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Button
            asChild
            variant="outline"
            className="rounded-none text-xs font-light border-black hover:bg-neutral-100"
          >
            <Link href="https://instagram.com/cyga.coorp" target="_blank">
              siga-nos no instagram
            </Link>
          </Button>
        </div>
      </section>
    )
  }

  // Renderizar mensagem de erro
  if (error) {
    return (
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-xl font-light text-center mb-12">@cyga.coorp</h2>
        <div className="text-center py-12">
          <Instagram className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button
            asChild
            variant="outline"
            className="rounded-none text-xs font-light border-black hover:bg-neutral-100"
          >
            <Link href="https://instagram.com/cyga.coorp" target="_blank">
              visitar nosso instagram
            </Link>
          </Button>
        </div>
      </section>
    )
  }

  // Renderizar posts do Instagram
  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <h2 className="text-xl font-light text-center mb-12">@cyga.coorp</h2>

      {usingExampleData && (
        <p className="text-xs text-center text-muted-foreground mb-6">
          Exibindo imagens de exemplo. Configure o token do Instagram para ver posts reais.
        </p>
      )}

      {posts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="aspect-square relative block overflow-hidden group"
            >
              <Image
                src={post.media_url || "/placeholder.svg"}
                alt={post.caption || "Post do Instagram Cyga"}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Nenhuma foto encontrada</p>
        </div>
      )}

      <div className="flex justify-center mt-8">
        <Button asChild variant="outline" className="rounded-none text-xs font-light border-black hover:bg-neutral-100">
          <Link href="https://instagram.com/cyga.coorp" target="_blank">
            siga-nos no instagram
          </Link>
        </Button>
      </div>
    </section>
  )
}
