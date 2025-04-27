import { NextResponse } from "next/server"
import { produtos } from "@/lib/produtos"

export async function GET(request: Request) {
  // Simulando um pequeno atraso para simular uma API real
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Obter parâmetros de consulta
  const { searchParams } = new URL(request.url)
  const categoria = searchParams.get("categoria")
  const material = searchParams.get("material")
  const precoMin = searchParams.get("precoMin")
  const precoMax = searchParams.get("precoMax")

  // Filtrar produtos com base nos parâmetros
  let produtosFiltrados = [...produtos]

  if (categoria) {
    produtosFiltrados = produtosFiltrados.filter((p) => p.categoria?.toLowerCase() === categoria.toLowerCase())
  }

  if (material) {
    produtosFiltrados = produtosFiltrados.filter((p) => p.material?.toLowerCase().includes(material.toLowerCase()))
  }

  // Retornar produtos filtrados
  return NextResponse.json(produtosFiltrados)
}
