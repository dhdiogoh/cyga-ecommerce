"use server"

import { supabaseAdmin } from "../supabase"
import type { Categoria } from "../supabase"

export async function getCategorias() {
  const { data, error } = await supabaseAdmin.from("categorias").select("*").order("nome")

  if (error) {
    console.error("Erro ao buscar categorias:", error)
    throw new Error("Não foi possível carregar as categorias")
  }

  return data
}

export async function getCategoriaPorId(id: string) {
  const { data, error } = await supabaseAdmin.from("categorias").select("*").eq("id", id).single()

  if (error) {
    console.error(`Erro ao buscar categoria ${id}:`, error)
    throw new Error("Não foi possível carregar a categoria")
  }

  return data
}

export async function criarCategoria(categoria: Omit<Categoria, "id" | "created_at">) {
  const { data, error } = await supabaseAdmin.from("categorias").insert(categoria).select().single()

  if (error) {
    console.error("Erro ao criar categoria:", error)
    throw new Error("Não foi possível criar a categoria")
  }

  return data
}

export async function atualizarCategoria(id: string, categoria: Partial<Categoria>) {
  const { data, error } = await supabaseAdmin.from("categorias").update(categoria).eq("id", id).select().single()

  if (error) {
    console.error(`Erro ao atualizar categoria ${id}:`, error)
    throw new Error("Não foi possível atualizar a categoria")
  }

  return data
}

export async function excluirCategoria(id: string) {
  const { error } = await supabaseAdmin.from("categorias").delete().eq("id", id)

  if (error) {
    console.error(`Erro ao excluir categoria ${id}:`, error)
    throw new Error("Não foi possível excluir a categoria")
  }

  return true
}
