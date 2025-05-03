import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Cliente para uso no navegador (cliente)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente com permissões elevadas para uso em Server Components e Server Actions
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Tipos para as tabelas do banco de dados
export type Produto = {
  id: string
  nome: string
  descricao: string
  preco: number
  categoria_id: string
  imagem_url?: string
  estoque: number
  tamanho?: string
  created_at: string
}

export type Categoria = {
  id: string
  nome: string
  descricao?: string
  ativa: boolean
  created_at: string
}

export type Cliente = {
  id: string
  nome: string
  email: string
  telefone?: string
  endereco?: string
  cidade?: string
  estado?: string
  cep?: string
  created_at: string
}

export type Pedido = {
  id: string
  cliente_id: string
  data: string
  status: string
  valor_total: number
  forma_pagamento: string
  status_pagamento: string
  created_at: string
}

export type ItemPedido = {
  id: string
  pedido_id: string
  produto_id: string
  quantidade: number
  preco_unitario: number
  subtotal: number
}

export type Estoque = {
  id: string
  produto_id: string
  quantidade: number
  updated_at: string
}
