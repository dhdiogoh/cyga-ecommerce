"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Loader2, ImageIcon, Trash2 } from "lucide-react"
import { criarProduto, uploadImagem, getCategorias } from "@/lib/services/produtos-service"

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
  imagem: z.instanceof(FileList).refine((files) => files.length > 0, {
    message: "A imagem é obrigatória.",
  }),
})

type FormValues = z.infer<typeof formSchema>

export function ProductForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [categorias, setCategorias] = useState<{ id: number; nome: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      valor: "", // Iniciar vazio, sem valor 0 fixo
      categoria_id: 0,
      tamanho: "",
      quantidade: "", // Iniciar vazio, sem valor 0 fixo
      imagem: undefined,
    },
  })

  // Carregar categorias ao montar o componente
  useEffect(() => {
    async function loadCategorias() {
      try {
        const data = await getCategorias()
        setCategorias(data)
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar as categorias",
          variant: "destructive",
        })
        console.error(error)
      }
    }

    loadCategorias()
  }, [])

  // Atualiza a categoria selecionada quando o valor do formulário muda
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "categoria_id") {
        const categoriaId = value.categoria_id
        const categoria = categorias.find((cat) => cat.id === Number(categoriaId))
        setSelectedCategory(categoria?.nome || "")
      }
    })
    return () => subscription.unsubscribe()
  }, [form.watch, categorias])

  // Efeito de limpeza para revogar URLs de blob ao desmontar o componente
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [])

  async function onSubmit(data: FormValues) {
    setIsLoading(true)

    try {
      // Fazer upload da imagem se existir
      let imageUrl = ""
      if (data.imagem && data.imagem.length > 0) {
        const file = data.imagem[0]
        // Encontrar o nome da categoria
        const categoria = categorias.find((cat) => cat.id === data.categoria_id)
        if (!categoria) {
          throw new Error("Categoria não encontrada")
        }
        // Passar o nome exato da categoria para a função de upload
        imageUrl = await uploadImagem(file, categoria.nome)
      }

      // Criar o produto
      await criarProduto({
        nome: data.nome,
        descricao: data.descricao,
        valor: data.valor,
        imagem: imageUrl,
        quantidade: data.quantidade,
        tamanho: data.tamanho,
        categoria_id: data.categoria_id,
      })

      toast({
        title: "Produto cadastrado com sucesso!",
        description: `O produto ${data.nome} foi cadastrado.`,
      })

      router.push("/dashboard/produtos")
    } catch (error) {
      console.error(error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao cadastrar o produto.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Revogar qualquer URL anterior
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview)
      }

      // Atualizar o preview com a nova imagem
      const objectUrl = URL.createObjectURL(file)
      setImagePreview(objectUrl)
    }
  }

  const handleRemoveImage = () => {
    // Revogar qualquer URL anterior
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview)
    }

    // Limpar o preview
    setImagePreview(null)

    // Zerar o campo do input file
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }

    // Remover a imagem do form
    form.setValue("imagem", undefined as any)
  }

  // Verifica se deve mostrar o campo de tamanho
  const showSizeField = selectedCategory === "Anel" || selectedCategory === "Colar"

  // Define o placeholder e label para o campo de tamanho com base na categoria
  const getSizeFieldProps = () => {
    if (selectedCategory === "Anel") {
      return {
        label: "Tamanho do Anel",
        placeholder: "Ex: 16, 17, 18",
        description: "Informe o número do anel",
      }
    } else if (selectedCategory === "Colar") {
      return {
        label: "Comprimento do Colar",
        placeholder: "Ex: 45, 50, 60",
        description: "Informe o comprimento em cm",
      }
    }
    return {
      label: "Tamanho",
      placeholder: "",
      description: "",
    }
  }

  const sizeFieldProps = getSizeFieldProps()

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Produto</FormLabel>
                  <FormControl>
                    <Input placeholder="Anel de Prata" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descreva o produto em detalhes..." className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="valor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="99.90"
                      {...field}
                      onChange={(e) => {
                        // Allow only numbers and one decimal point
                        let value = e.target.value

                        // Substitui vírgula por ponto
                        value = value.replace(",", ".")

                        // Remove caracteres inválidos (mantém números e no máximo um ponto)
                        value = value.replace(/[^\d.]/g, "")

                        // Garante que só exista um ponto decimal
                        const parts = value.split(".")
                        if (parts.length > 2) {
                          value = parts[0] + "." + parts.slice(1).join("")
                        }

                        field.onChange(value ? value : "")
                      }}
                      className="appearance-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="categoria_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value) || 0)}
                    value={field.value ? field.value.toString() : ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categorias.map((categoria) => (
                        <SelectItem key={categoria.id} value={categoria.id.toString()}>
                          {categoria.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showSizeField && (
              <FormField
                control={form.control}
                name="tamanho"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{sizeFieldProps.label}</FormLabel>
                    <FormControl>
                      <Input placeholder={sizeFieldProps.placeholder} {...field} />
                    </FormControl>
                    <FormDescription>{sizeFieldProps.description}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="quantidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="100"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, "")
                        field.onChange(value ? Number.parseInt(value) : "")
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imagem"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Imagem do Produto</FormLabel>
                  <FormControl>
                    <div className="grid w-full gap-2">
                      {imagePreview ? (
                        <div className="relative aspect-square w-full max-w-[200px] overflow-hidden rounded-md">
                          <img
                            key={imagePreview} // Forçar re-renderização quando a imagem mudar
                            src={imagePreview || "/placeholder.svg"}
                            alt="Preview"
                            className="h-full w-full object-cover"
                            onError={() => {
                              setImagePreview(null)
                              toast({
                                title: "Erro",
                                description: "Não foi possível carregar a imagem",
                                variant: "destructive",
                              })
                            }}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute right-1 top-1 h-6 w-6 rounded-full"
                            onClick={handleRemoveImage}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remover imagem</span>
                          </Button>
                        </div>
                      ) : (
                        <label
                          htmlFor="image-upload"
                          className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 p-4 text-center hover:bg-gray-50"
                        >
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500">Clique para fazer upload ou arraste e solte</p>
                        </label>
                      )}
                      <Input
                        id="image-upload"
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="cursor-pointer"
                        onChange={(e) => {
                          handleImageChange(e)
                          // Only set files if they exist
                          if (e.target.files && e.target.files.length > 0) {
                            onChange(e.target.files)
                          }
                        }}
                        {...fieldProps}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>Formatos aceitos: JPG, PNG, GIF</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/produtos")}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Produto"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
