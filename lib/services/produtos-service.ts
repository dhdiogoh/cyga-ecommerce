"use server"

import { supabaseAdmin } from "../supabase"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Tipo para o produto conforme as colunas do banco
export type Produto = {
  id?: string
  nome: string
  descricao: string
  valor: number
  imagem?: string
  quantidade: number
  tamanho?: string
  categoria_id: number
  status?: boolean // Adicionado campo status
}

// Esquema de validação do formulário
const formSchema = z.object({
  nome: z.string().min(3, {
    message: "O nome do produto deve ter pelo menos 3 caracteres.",
  }),
  descricao: z.string().min(10, {
    message: "A descrição deve ter pelo menos 10 caracteres.",
  }),
  valor: z.coerce.number().positive({
    message: "O preço deve ser um valor positivo.",
  }),
  categoria_id: z.coerce.number().int().positive({
    message: "Selecione uma categoria.",
  }),
  tamanho: z.string().optional(),
  quantidade: z.coerce.number().int().positive({
    message: "A quantidade deve ser um número inteiro positivo.",
  }),
  imagem: z.any(), // Usar z.any() para evitar referência a FileList no servidor
  status: z.boolean().optional().default(true), // Adicionado campo status com default true
})

export async function getProdutos() {
  const { data, error } = await supabaseAdmin.from("produtos").select("*, categorias(id, nome)").order("nome")

  if (error) {
    console.error("Erro ao buscar produtos:", error)
    throw new Error("Não foi possível carregar os produtos")
  }

  return data
}

export async function getProdutoPorId(id: string) {
  const { data, error } = await supabaseAdmin.from("produtos").select("*, categorias(id, nome)").eq("id", id).single()

  if (error) {
    console.error(`Erro ao buscar produto ${id}:`, error)
    throw new Error("Não foi possível carregar o produto")
  }

  return data
}

export async function getCategorias() {
  const { data, error } = await supabaseAdmin.from("categorias").select("id, nome").order("nome")

  if (error) {
    console.error("Erro ao buscar categorias:", error)
    throw new Error("Não foi possível carregar as categorias")
  }

  return data
}

export async function criarProduto(produto: Produto) {
  // Upload da imagem para o Storage do Supabase, se houver
  const imagemUrl = produto.imagem

  const { data, error } = await supabaseAdmin
    .from("produtos")
    .insert({
      nome: produto.nome,
      descricao: produto.descricao,
      valor: produto.valor,
      imagem: imagemUrl,
      quantidade: produto.quantidade,
      tamanho: produto.tamanho,
      categoria_id: produto.categoria_id,
      status: produto.status !== undefined ? produto.status : true, // Definir status como true por padrão
    })
    .select()
    .single()

  if (error) {
    console.error("Erro ao criar produto:", error)
    throw new Error("Não foi possível criar o produto")
  }

  // Revalidar o cache da página de produtos
  revalidatePath("/dashboard/produtos")

  return data
}

export async function atualizarProduto(id: string, produto: Partial<Produto>) {
  // Primeiro, verificar se o produto já existe e se tem uma imagem
  const { data: produtoExistente, error: fetchError } = await supabaseAdmin
    .from("produtos")
    .select("imagem")
    .eq("id", id)
    .single()

  if (fetchError) {
    console.error(`Erro ao buscar produto ${id} para atualização:`, fetchError)
    throw new Error("Não foi possível encontrar o produto para atualização")
  }

  // Atualizar o produto primeiro
  const { data, error } = await supabaseAdmin
    .from("produtos")
    .update({
      nome: produto.nome,
      descricao: produto.descricao,
      valor: produto.valor,
      imagem: produto.imagem,
      quantidade: produto.quantidade,
      tamanho: produto.tamanho,
      categoria_id: produto.categoria_id,
      status: produto.status, // Atualizar status
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error(`Erro ao atualizar produto ${id}:`, error)
    throw new Error("Não foi possível atualizar o produto")
  }

  // Após o sucesso da atualização, se o produto tinha uma imagem e agora está sendo atualizado com uma nova imagem ou sem imagem,
  // excluir a imagem antiga do storage
  if (produtoExistente?.imagem && produtoExistente.imagem !== produto.imagem && produto.imagem !== undefined) {
    const filePath = extractPathFromUrl(produtoExistente.imagem)

    if (filePath) {
      const { error: storageError } = await supabaseAdmin.storage.from("imagens-cyga").remove([filePath])

      if (storageError) {
        console.error(`Erro ao excluir imagem antiga do storage:`, storageError)
        // Não interromper o processo se a exclusão da imagem falhar
      } else {
        console.log(`Imagem antiga excluída com sucesso: ${filePath}`)
      }
    }
  }

  // Revalidar o cache da página de produtos
  revalidatePath("/dashboard/produtos")

  return data
}

// Função melhorada para extrair o caminho do arquivo da URL pública
function extractPathFromUrl(url: string): string | null {
  if (!url) return null

  try {
    // Verificar se a URL contém o caminho do bucket
    if (url.includes("/imagens-cyga/")) {
      // Extrair o caminho após o nome do bucket
      const bucketName = "imagens-cyga"
      const bucketIndex = url.indexOf(bucketName)

      if (bucketIndex !== -1) {
        // Pegar tudo após o nome do bucket + /
        const pathStartIndex = bucketIndex + bucketName.length + 1

        // Se houver parâmetros de consulta, remover
        let path = url.substring(pathStartIndex)
        const queryIndex = path.indexOf("?")

        if (queryIndex !== -1) {
          path = path.substring(0, queryIndex)
        }

        return path
      }
    }

    // Tentativa alternativa: extrair usando padrões de URL do Supabase
    const patterns = ["/storage/v1/object/public/imagens-cyga/", "/storage/v1/object/sign/imagens-cyga/"]

    for (const pattern of patterns) {
      if (url.includes(pattern)) {
        const parts = url.split(pattern)
        if (parts.length === 2) {
          // Remover parâmetros de consulta se existirem
          const queryIndex = parts[1].indexOf("?")
          return queryIndex !== -1 ? parts[1].substring(0, queryIndex) : parts[1]
        }
      }
    }

    console.log("Não foi possível extrair o caminho da URL usando métodos conhecidos:", url)
    return null
  } catch (error) {
    console.error("Erro ao extrair caminho da URL:", error)
    return null
  }
}

export async function excluirProduto(id: string) {
  // Primeiro, buscar o produto para obter a URL da imagem
  const { data: produto, error: fetchError } = await supabaseAdmin
    .from("produtos")
    .select("imagem")
    .eq("id", id)
    .single()

  if (fetchError) {
    console.error(`Erro ao buscar produto ${id} para exclusão:`, fetchError)
    throw new Error("Não foi possível encontrar o produto para exclusão")
  }

  // Excluir o produto da tabela
  const { error } = await supabaseAdmin.from("produtos").delete().eq("id", id)

  if (error) {
    console.error(`Erro ao excluir produto ${id}:`, error)
    throw new Error("Não foi possível excluir o produto")
  }

  // Se o produto tem uma imagem, excluí-la do storage após a exclusão do produto
  if (produto?.imagem) {
    const filePath = extractPathFromUrl(produto.imagem)

    if (filePath) {
      console.log(`Tentando excluir imagem: ${filePath}`)
      const { error: storageError } = await supabaseAdmin.storage.from("imagens-cyga").remove([filePath])

      if (storageError) {
        console.error(`Erro ao excluir imagem do storage:`, storageError)
        // Não interromper o processo se a exclusão da imagem falhar
      } else {
        console.log(`Imagem excluída com sucesso: ${filePath}`)
      }
    } else {
      console.log(`Não foi possível extrair o caminho da imagem: ${produto.imagem}`)
    }
  }

  // Revalidar o cache da página de produtos
  revalidatePath("/dashboard/produtos")

  return true
}

// Função para obter o nome da pasta com base na categoria
function getPastaCategoria(categoriaNome: string): string {
  // Garantir que estamos trabalhando com uma string válida e normalizada
  const categoriaLower = categoriaNome?.trim().toLowerCase() || ""

  switch (categoriaLower) {
    case "anel":
      return "aneis"
    case "brinco":
      return "brincos"
    case "colar":
      return "colares"
    case "pulseira":
      return "pulseiras"
    default:
      return "outros"
  }
}

// Função para fazer upload de imagem para o Supabase Storage
export async function uploadImagem(file: File, categoriaNome: string) {
  if (!file) {
    throw new Error("Nenhum arquivo fornecido para upload")
  }

  const pasta = getPastaCategoria(categoriaNome)
  console.log(`Categoria: ${categoriaNome} -> Pasta: ${pasta}`) // Log para depuração

  // Gerar um nome de arquivo único para evitar colisões
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 8)
  const fileExtension = file.name.split(".").pop()
  const nomeArquivo = `${pasta}/${timestamp}-${randomString}.${fileExtension}`

  const { data, error } = await supabaseAdmin.storage.from("imagens-cyga").upload(nomeArquivo, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error) {
    console.error("Erro ao fazer upload da imagem:", error)
    throw new Error("Não foi possível fazer upload da imagem")
  }

  // Obter a URL pública da imagem
  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from("imagens-cyga").getPublicUrl(nomeArquivo)

  return publicUrl
}

// Função para obter a categoria pelo ID
export async function getCategoriaPorId(id: number) {
  const { data, error } = await supabaseAdmin.from("categorias").select("nome").eq("id", id).single()

  if (error) {
    console.error(`Erro ao buscar categoria ${id}:`, error)
    throw new Error("Não foi possível carregar a categoria")
  }

  return data
}

// Função para buscar produtos com filtros
export async function getProdutosComFiltros(filtros: any = {}) {
  console.log("Filtros recebidos:", filtros) // Debug log

  let query = supabaseAdmin.from("produtos").select("*, categorias(id, nome)")

  // Aplicar filtros de forma mais robusta
  if (filtros.categoria_id && filtros.categoria_id !== "all") {
    query = query.eq("categoria_id", Number(filtros.categoria_id))
    console.log("Filtro categoria aplicado:", filtros.categoria_id)
  }

  if (filtros.preco_min !== undefined && filtros.preco_min !== null && filtros.preco_min !== "") {
    query = query.gte("valor", Number(filtros.preco_min))
    console.log("Filtro preço mínimo aplicado:", filtros.preco_min)
  }

  if (filtros.preco_max !== undefined && filtros.preco_max !== null && filtros.preco_max !== "") {
    query = query.lte("valor", Number(filtros.preco_max))
    console.log("Filtro preço máximo aplicado:", filtros.preco_max)
  }

  if (filtros.estoque_min !== undefined && filtros.estoque_min !== null && filtros.estoque_min !== "") {
    query = query.gte("quantidade", Number(filtros.estoque_min))
    console.log("Filtro estoque mínimo aplicado:", filtros.estoque_min)
  }

  if (filtros.estoque_max !== undefined && filtros.estoque_max !== null && filtros.estoque_max !== "") {
    query = query.lte("quantidade", Number(filtros.estoque_max))
    console.log("Filtro estoque máximo aplicado:", filtros.estoque_max)
  }

  // CORREÇÃO: Usar status em vez de ativo
  if (filtros.status && filtros.status !== "all") {
    const isAtivo = filtros.status === "ativo"
    query = query.eq("status", isAtivo)
    console.log("Filtro status aplicado:", filtros.status, "-> status:", isAtivo)
  }

  if (filtros.busca && filtros.busca.trim() !== "") {
    query = query.ilike("nome", `%${filtros.busca.trim()}%`)
    console.log("Filtro busca aplicado:", filtros.busca)
  }

  if (filtros.data_inicio && filtros.data_inicio !== "") {
    query = query.gte("created_at", filtros.data_inicio + "T00:00:00")
    console.log("Filtro data início aplicado:", filtros.data_inicio)
  }

  if (filtros.data_fim && filtros.data_fim !== "") {
    query = query.lte("created_at", filtros.data_fim + "T23:59:59")
    console.log("Filtro data fim aplicado:", filtros.data_fim)
  }

  // Ordenar por nome
  query = query.order("nome")

  const { data, error } = await query

  if (error) {
    console.error("Erro ao buscar produtos com filtros:", error)
    throw new Error("Não foi possível carregar os produtos")
  }

  console.log("Produtos retornados do banco:", data?.length || 0) // Debug log
  return data || []
}

// Nova função para obter contagem total de produtos
export async function getContagemProdutos() {
  const { count, error } = await supabaseAdmin.from("produtos").select("*", { count: "exact", head: true })

  if (error) {
    console.error("Erro ao contar produtos:", error)
    return 0
  }

  return count || 0
}

// Função para verificar se a coluna 'status' existe na tabela produtos
export async function verificarEstruturaBanco() {
  try {
    const { data, error } = await supabaseAdmin.from("produtos").select("status").limit(1)

    if (error && error.message.includes("column")) {
      console.warn("Coluna 'status' não existe na tabela produtos")
      return false
    }

    return true
  } catch (error) {
    console.warn("Não foi possível verificar a estrutura do banco:", error)
    return false
  }
}

// Função para edição em massa
export async function atualizarProdutosEmMassa(produtoIds: string[], updates: any) {
  const { data, error } = await supabaseAdmin.from("produtos").update(updates).in("id", produtoIds).select()

  if (error) {
    console.error("Erro na edição em massa:", error)
    throw new Error("Não foi possível atualizar os produtos")
  }

  // Revalidar o cache da página de produtos
  revalidatePath("/dashboard/produtos")

  return data
}

// Função para aplicar desconto em massa
export async function aplicarDescontoEmMassa(
  produtoIds: string[],
  tipoDesconto: "percentage" | "fixed",
  valorDesconto: number,
) {
  // Buscar os produtos atuais
  const { data: produtos, error: fetchError } = await supabaseAdmin
    .from("produtos")
    .select("id, valor")
    .in("id", produtoIds)

  if (fetchError) {
    console.error("Erro ao buscar produtos para desconto:", fetchError)
    throw new Error("Não foi possível buscar os produtos")
  }

  // Calcular novos preços
  const updates = produtos.map((produto) => {
    let novoValor: number

    if (tipoDesconto === "percentage") {
      novoValor = produto.valor * (1 - valorDesconto / 100)
    } else {
      novoValor = produto.valor - valorDesconto
    }

    // Garantir que o preço não seja negativo
    novoValor = Math.max(0.01, novoValor)

    return {
      id: produto.id,
      valor: Number(novoValor.toFixed(2)),
    }
  })

  // Atualizar cada produto individualmente
  const promises = updates.map((update) =>
    supabaseAdmin.from("produtos").update({ valor: update.valor }).eq("id", update.id),
  )

  const results = await Promise.all(promises)

  // Verificar se houve erros
  const errors = results.filter((result) => result.error)
  if (errors.length > 0) {
    console.error("Erros na aplicação de desconto:", errors)
    throw new Error("Não foi possível aplicar o desconto em todos os produtos")
  }

  // Revalidar o cache da página de produtos
  revalidatePath("/dashboard/produtos")

  return updates
}
