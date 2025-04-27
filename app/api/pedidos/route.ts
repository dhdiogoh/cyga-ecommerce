import { NextResponse } from "next/server"

// Simulação de um banco de dados de pedidos
const pedidos = [
  {
    id: "12345",
    usuario_id: "1",
    data: "2023-04-15T10:30:00Z",
    status: "entregue",
    itens: [
      {
        produto_id: "1",
        nome: "Anel Solitário Elegance",
        preco: "R$ 299,90",
        quantidade: 1,
      },
      {
        produto_id: "2",
        nome: "Colar Pérolas Delicadas",
        preco: "R$ 189,90",
        quantidade: 2,
      },
    ],
    endereco_entrega: {
      nome: "Maria Silva",
      rua: "Rua das Flores",
      numero: "123",
      complemento: "Apto 45",
      bairro: "Jardim Primavera",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01234-567",
    },
    metodo_pagamento: "cartao_credito",
    subtotal: "R$ 679,70",
    frete: "R$ 19,90",
    total: "R$ 699,60",
  },
  {
    id: "12289",
    usuario_id: "1",
    data: "2023-03-02T14:15:00Z",
    status: "entregue",
    itens: [
      {
        produto_id: "5",
        nome: "Anel Aliança Infinito",
        preco: "R$ 259,90",
        quantidade: 1,
      },
      {
        produto_id: "7",
        nome: "Brincos Argola Minimalista",
        preco: "R$ 129,90",
        quantidade: 1,
      },
      {
        produto_id: "10",
        nome: "Colar Choker",
        preco: "R$ 149,90",
        quantidade: 1,
      },
    ],
    endereco_entrega: {
      nome: "Maria Silva",
      rua: "Av. Paulista",
      numero: "1000",
      complemento: "Sala 1010",
      bairro: "Bela Vista",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01310-100",
    },
    metodo_pagamento: "boleto",
    subtotal: "R$ 539,70",
    frete: "R$ 0,00",
    total: "R$ 539,70",
  },
]

export async function GET(request: Request) {
  // Simulando um pequeno atraso para simular uma API real
  await new Promise((resolve) => setTimeout(resolve, 500))

  const { searchParams } = new URL(request.url)
  const usuario_id = searchParams.get("usuario_id")
  const pedido_id = searchParams.get("pedido_id")

  if (pedido_id) {
    // Retornar um pedido específico
    const pedido = pedidos.find((p) => p.id === pedido_id)

    if (!pedido) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 })
    }

    return NextResponse.json(pedido)
  }

  if (usuario_id) {
    // Retornar todos os pedidos de um usuário
    const pedidosUsuario = pedidos.filter((p) => p.usuario_id === usuario_id)
    return NextResponse.json(pedidosUsuario)
  }

  // Retornar todos os pedidos (em um sistema real, isso seria protegido)
  return NextResponse.json(pedidos)
}

export async function POST(request: Request) {
  const data = await request.json()

  // Validar dados do pedido
  if (!data.usuario_id || !data.itens || data.itens.length === 0) {
    return NextResponse.json({ error: "Dados do pedido inválidos" }, { status: 400 })
  }

  // Criar novo pedido
  const novoPedido = {
    id: Math.floor(10000 + Math.random() * 90000).toString(), // Gerar ID aleatório
    usuario_id: data.usuario_id,
    data: new Date().toISOString(),
    status: "processando",
    itens: data.itens,
    endereco_entrega: data.endereco_entrega,
    metodo_pagamento: data.metodo_pagamento,
    subtotal: data.subtotal,
    frete: data.frete,
    total: data.total,
  }

  pedidos.push(novoPedido)

  return NextResponse.json({
    message: "Pedido criado com sucesso",
    pedido: novoPedido,
  })
}
