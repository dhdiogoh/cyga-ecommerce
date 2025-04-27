import { NextResponse } from "next/server"

// Simulação de um banco de dados de usuários
const usuarios = [
  {
    id: "1",
    nome: "Maria",
    sobrenome: "Silva",
    email: "maria.silva@email.com",
    senha: "senha123", // Em um sistema real, isso seria um hash
    cpf: "123.456.789-00",
    telefone: "(11) 98765-4321",
    enderecos: [
      {
        id: "1",
        nome: "Maria Silva",
        rua: "Rua das Flores",
        numero: "123",
        complemento: "Apto 45",
        bairro: "Jardim Primavera",
        cidade: "São Paulo",
        estado: "SP",
        cep: "01234-567",
        telefone: "(11) 98765-4321",
        principal: true,
      },
      {
        id: "2",
        nome: "Maria Silva",
        rua: "Av. Paulista",
        numero: "1000",
        complemento: "Sala 1010",
        bairro: "Bela Vista",
        cidade: "São Paulo",
        estado: "SP",
        cep: "01310-100",
        telefone: "(11) 3456-7890",
        principal: false,
      },
    ],
  },
]

export async function POST(request: Request) {
  const data = await request.json()

  // Verificar se o e-mail já está cadastrado
  const usuarioExistente = usuarios.find((u) => u.email === data.email)

  if (usuarioExistente) {
    return NextResponse.json({ error: "E-mail já cadastrado" }, { status: 400 })
  }

  // Em um sistema real, a senha seria hash antes de armazenar
  const novoUsuario = {
    id: (usuarios.length + 1).toString(),
    nome: data.nome,
    sobrenome: data.sobrenome,
    email: data.email,
    senha: data.senha,
    cpf: data.cpf,
    telefone: data.telefone,
    enderecos: [],
  }

  usuarios.push(novoUsuario)

  // Não retornar a senha na resposta
  const { senha, ...usuarioSemSenha } = novoUsuario

  return NextResponse.json({
    message: "Usuário cadastrado com sucesso",
    usuario: usuarioSemSenha,
  })
}

// Rota de login
export async function PUT(request: Request) {
  const data = await request.json()

  // Verificar credenciais
  const usuario = usuarios.find((u) => u.email === data.email && u.senha === data.senha)

  if (!usuario) {
    return NextResponse.json({ error: "E-mail ou senha inválidos" }, { status: 401 })
  }

  // Não retornar a senha na resposta
  const { senha, ...usuarioSemSenha } = usuario

  return NextResponse.json({
    message: "Login realizado com sucesso",
    usuario: usuarioSemSenha,
  })
}
