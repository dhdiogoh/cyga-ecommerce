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
