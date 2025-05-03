"use server"

import { supabaseAdmin } from "../supabase"
import type { Pedido, ItemPedido } from "../supabase"

export async function getPedidos() {
  const { data, error } = await supabaseAdmin
    .from("pedidos")
    .select("*, clientes(nome, email)")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao buscar pedidos:", error)
    throw new Error("Não foi possível carregar os pedidos")
  }

  return data
}

export async function getPedidoPorId(id: string) {
  const { data: pedido, error: pedidoError } = await supabaseAdmin
    .from("pedidos")
    .select("*, clientes(nome, email)")
    .eq("id", id)
    .single()

  if (pedidoError) {
    console.error(`Erro ao buscar pedido ${id}:`, pedidoError)
    throw new Error("Não foi possível carregar o pedido")
  }

  const { data: itensPedido, error: itensError } = await supabaseAdmin
    .from("itens_pedido")
    .select("*, produtos(nome, imagem_url)")
    .eq("pedido_id", id)

  if (itensError) {
    console.error(`Erro ao buscar itens do pedido ${id}:`, itensError)
    throw new Error("Não foi possível carregar os itens do pedido")
  }

  return { pedido, itens: itensPedido }
}

export async function criarPedido(
  pedido: Omit<Pedido, "id" | "created_at">,
  itens: Omit<ItemPedido, "id" | "pedido_id">[],
) {
  // Iniciar uma transação
  const { data: novoPedido, error: pedidoError } = await supabaseAdmin.from("pedidos").insert(pedido).select().single()

  if (pedidoError) {
    console.error("Erro ao criar pedido:", pedidoError)
    throw new Error("Não foi possível criar o pedido")
  }

  // Adicionar os itens do pedido
  const itensComPedidoId = itens.map((item) => ({
    ...item,
    pedido_id: novoPedido.id,
  }))

  const { error: itensError } = await supabaseAdmin.from("itens_pedido").insert(itensComPedidoId)

  if (itensError) {
    console.error("Erro ao adicionar itens ao pedido:", itensError)
    throw new Error("Não foi possível adicionar os itens ao pedido")
  }

  // Atualizar o estoque
  for (const item of itens) {
    await supabaseAdmin.rpc("atualizar_estoque", {
      p_produto_id: item.produto_id,
      p_quantidade: -item.quantidade,
    })
  }

  return novoPedido
}

export async function atualizarStatusPedido(id: string, status: string, statusPagamento: string) {
  const { data, error } = await supabaseAdmin
    .from("pedidos")
    .update({
      status: status,
      status_pagamento: statusPagamento,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error(`Erro ao atualizar status do pedido ${id}:`, error)
    throw new Error("Não foi possível atualizar o status do pedido")
  }

  return data
}
