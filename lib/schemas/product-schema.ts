"use client"

import { z } from "zod"

// Esquema de validação para o formulário de produto (cliente)
export const productFormSchema = z.object({
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
  imagem: typeof FileList !== "undefined" ? z.instanceof(FileList).optional() : z.any(),
})

// Esquema de validação para o formulário de produto (novo produto)
export const newProductFormSchema = z.object({
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
  imagem:
    typeof FileList !== "undefined"
      ? z.instanceof(FileList).refine((files) => files.length > 0, {
          message: "A imagem é obrigatória.",
        })
      : z.any(),
})

export type ProductFormValues = z.infer<typeof productFormSchema>
export type NewProductFormValues = z.infer<typeof newProductFormSchema>
