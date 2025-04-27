import { NextResponse } from "next/server"

// Simulação de um carrinho de compras
let carrinho = [
  {
    id: "1",
    nome: "Anel Solitário Elegance",
    preco: "R$ 299,90",
    quantidade: 1,
    imagem: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "2",
    nome: "Colar Pérolas Delicadas",
    preco: "R$ 189,90",
    quantidade: 2,
    imagem: "/placeholder.svg?height=200&width=200",
  },
]

export async function GET() {
  // Simulando um pequeno atraso para simular uma API real
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json(carrinho)
}

export async function POST(request: Request) {
  const data = await request.json()

  // Verificar se o produto já existe no carrinho
  const produtoExistente = carrinho.find((item) => item.id === data.id)

  if (produtoExistente) {
    // Atualizar quantidade
    produtoExistente.quantidade += data.quantidade || 1
  } else {
    // Adicionar novo produto
    carrinho.push({
      id: data.id,
      nome: data.nome,
      preco: data.preco,
      quantidade: data.quantidade || 1,
      imagem: data.imagem,
    })
  }

  return NextResponse.json({
    message: "Produto adicionado ao carrinho",
    carrinho,
  })
}

export async function PUT(request: Request) {
  const data = await request.json()

  // Atualizar quantidade de um produto
  carrinho = carrinho.map((item) => {
    if (item.id === data.id) {
      return { ...item, quantidade: data.quantidade }
    }
    return item
  })

  return NextResponse.json({
    message: "Carrinho atualizado",
    carrinho,
  })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (id) {
    // Remover um produto específico
    carrinho = carrinho.filter((item) => item.id !== id)

    return NextResponse.json({
      message: "Produto removido do carrinho",
      carrinho,
    })
  } else {
    // Limpar todo o carrinho
    carrinho = []

    return NextResponse.json({
      message: "Carrinho esvaziado",
      carrinho,
    })
  }
}
