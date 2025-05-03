"use server"

import { supabaseAdmin } from "../supabase"
import type { Cliente } from "../supabase"

export async function getClientes() {
  const { data, error } = await supabaseAdmin.from("clientes").select("*").order("nome")

  if (error) {
    console.error("Erro ao buscar clientes:", error)
    throw new Error("Não foi possível carregar os clientes")
  }

  return data
}

export async function getClientePorId(id: string) {
  const { data, error } = await supabaseAdmin.from("clientes").select("*").eq("id", id).single()

  if (error) {
    console.error(`Erro ao buscar cliente ${id}:`, error)
    throw new Error("Não foi possível carregar o cliente")
  }

  return data
}

export async function criarCliente(cliente: Omit<Cliente, "id" | "created_at">) {
  const { data, error } = await supabaseAdmin.from("clientes").insert(cliente).select().single()

  if (error) {
    console.error("Erro ao criar cliente:", error)
    throw new Error("Não foi possível criar o cliente")
  }

  return data
}

export async function atualizarCliente(id: string, cliente: Partial<Cliente>) {
  const { data, error } = await supabaseAdmin.from("clientes").update(cliente).eq("id", id).select().single()

  if (error) {
    console.error(`Erro ao atualizar cliente ${id}:`, error)
    throw new Error("Não foi possível atualizar o cliente")
  }

  return data
}

export async function excluirCliente(id: string) {
  const { error } = await supabaseAdmin.from("clientes").delete().eq("id", id)

  if (error) {
    console.error(`Erro ao excluir cliente ${id}:`, error)
    throw new Error("Não foi possível excluir o cliente")
  }

  return true
}
