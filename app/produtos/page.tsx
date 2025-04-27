"use client"

import { produtos } from "@/lib/produtos"
import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"

// Tipos para os filtros
type Categoria = "Anéis" | "Brincos" | "Colares" | "Pulseiras"
type Material = "Ouro" | "Prata" | "Aço"
type FaixaPreco = "0-100" | "100-300" | "300-500" | "500+"
type OrdenacaoOpcao = "recentes" | "preco-asc" | "preco-desc" | "nome-asc"

export default function ProdutosPage() {
  // Estado para controlar a visibilidade dos filtros em dispositivos móveis
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Estados para os filtros selecionados (ainda não aplicados)
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<Categoria[]>([])
  const [materiaisSelecionados, setMateriaisSelecionadas] = useState<Material[]>([])
  const [faixasPrecoSelecionadas, setFaixasPrecoSelecionadas] = useState<FaixaPreco[]>([])
  const [ordenacaoSelecionada, setOrdenacaoSelecionada] = useState<OrdenacaoOpcao>("recentes")

  // Estados para os filtros aplicados (que afetam os produtos exibidos)
  const [categoriasFiltradas, setCategoriasFiltradas] = useState<Categoria[]>([])
  const [materiaisFiltrados, setMateriaisFiltrados] = useState<Material[]>([])
  const [faixasPrecoFiltradas, setFaixasPrecoFiltradas] = useState<FaixaPreco[]>([])
  const [ordenacao, setOrdenacao] = useState<OrdenacaoOpcao>("recentes")

  // Estado para os produtos filtrados
  const [produtosFiltrados, setProdutosFiltrados] = useState(produtos)

  // Função para converter string de preço para número
  const precoParaNumero = (preco: string): number => {
    return Number(preco.replace("R$ ", "").replace(",", "."))
  }

  // Função para verificar se um produto está dentro de uma faixa de preço
  const produtoNaFaixaPreco = (produto: (typeof produtos)[0], faixa: FaixaPreco): boolean => {
    const preco = precoParaNumero(produto.preco)

    switch (faixa) {
      case "0-100":
        return preco < 100
      case "100-300":
        return preco >= 100 && preco < 300
      case "300-500":
        return preco >= 300 && preco < 500
      case "500+":
        return preco >= 500
      default:
        return false
    }
  }

  // Função para aplicar os filtros selecionados
  const aplicarFiltros = () => {
    // Atualizar os estados de filtros aplicados com os valores selecionados
    setCategoriasFiltradas(categoriasSelecionadas)
    setMateriaisFiltrados(materiaisSelecionados)
    setFaixasPrecoFiltradas(faixasPrecoSelecionadas)
    setOrdenacao(ordenacaoSelecionada)

    // Fechar o painel de filtros móveis após aplicar
    setMobileFiltersOpen(false)
  }

  // Efeito para filtrar os produtos quando os filtros aplicados mudarem
  useEffect(() => {
    let resultado = [...produtos]

    // Filtrar por categoria
    if (categoriasFiltradas.length > 0) {
      resultado = resultado.filter(
        (produto) => produto.categoria && categoriasFiltradas.includes(produto.categoria as Categoria),
      )
    }

    // Filtrar por material
    if (materiaisFiltrados.length > 0) {
      resultado = resultado.filter((produto) => {
        if (!produto.material) return false
        return materiaisFiltrados.some((material) => produto.material?.includes(material))
      })
    }

    // Filtrar por faixa de preço
    if (faixasPrecoFiltradas.length > 0) {
      resultado = resultado.filter((produto) =>
        faixasPrecoFiltradas.some((faixa) => produtoNaFaixaPreco(produto, faixa)),
      )
    }

    // Aplicar ordenação
    switch (ordenacao) {
      case "preco-asc":
        resultado.sort((a, b) => precoParaNumero(a.preco) - precoParaNumero(b.preco))
        break
      case "preco-desc":
        resultado.sort((a, b) => precoParaNumero(b.preco) - precoParaNumero(a.preco))
        break
      case "nome-asc":
        resultado.sort((a, b) => a.nome.localeCompare(b.nome))
        break
      case "recentes":
      default:
        // Assumindo que os produtos já estão ordenados por mais recentes
        break
    }

    setProdutosFiltrados(resultado)
  }, [categoriasFiltradas, materiaisFiltrados, faixasPrecoFiltradas, ordenacao])

  // Função para alternar uma categoria no filtro
  const toggleCategoria = (categoria: Categoria) => {
    setCategoriasSelecionadas((prev) =>
      prev.includes(categoria) ? prev.filter((c) => c !== categoria) : [...prev, categoria],
    )
  }

  // Função para alternar um material no filtro
  const toggleMaterial = (material: Material) => {
    setMateriaisSelecionadas((prev) =>
      prev.includes(material) ? prev.filter((m) => m !== material) : [...prev, material],
    )
  }

  // Função para alternar uma faixa de preço no filtro
  const toggleFaixaPreco = (faixa: FaixaPreco) => {
    setFaixasPrecoSelecionadas((prev) => (prev.includes(faixa) ? prev.filter((f) => f !== faixa) : [...prev, faixa]))
  }

  // Função para limpar todos os filtros
  const limparFiltros = () => {
    // Limpar filtros selecionados
    setCategoriasSelecionadas([])
    setMateriaisSelecionadas([])
    setFaixasPrecoSelecionadas([])
    setOrdenacaoSelecionada("recentes")

    // Limpar filtros aplicados
    setCategoriasFiltradas([])
    setMateriaisFiltradas([])
    setFaixasPrecoFiltradas([])
    setOrdenacao("recentes")
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-light text-center mb-12">PRODUTOS</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filtros - Sidebar */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <h2 className="text-lg font-medium mb-4">Filtros</h2>

            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Categorias</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="aneis"
                    className="mr-2"
                    checked={categoriasSelecionadas.includes("Anéis")}
                    onChange={() => toggleCategoria("Anéis")}
                  />
                  <label htmlFor="aneis" className="text-sm">
                    Anéis
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="brincos"
                    className="mr-2"
                    checked={categoriasSelecionadas.includes("Brincos")}
                    onChange={() => toggleCategoria("Brincos")}
                  />
                  <label htmlFor="brincos" className="text-sm">
                    Brincos
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="colares"
                    className="mr-2"
                    checked={categoriasSelecionadas.includes("Colares")}
                    onChange={() => toggleCategoria("Colares")}
                  />
                  <label htmlFor="colares" className="text-sm">
                    Colares
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="pulseiras"
                    className="mr-2"
                    checked={categoriasSelecionadas.includes("Pulseiras")}
                    onChange={() => toggleCategoria("Pulseiras")}
                  />
                  <label htmlFor="pulseiras" className="text-sm">
                    Pulseiras
                  </label>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Material</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="ouro"
                    className="mr-2"
                    checked={materiaisSelecionados.includes("Ouro")}
                    onChange={() => toggleMaterial("Ouro")}
                  />
                  <label htmlFor="ouro" className="text-sm">
                    Ouro
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="prata"
                    className="mr-2"
                    checked={materiaisSelecionados.includes("Prata")}
                    onChange={() => toggleMaterial("Prata")}
                  />
                  <label htmlFor="prata" className="text-sm">
                    Prata
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="aco"
                    className="mr-2"
                    checked={materiaisSelecionados.includes("Aço")}
                    onChange={() => toggleMaterial("Aço")}
                  />
                  <label htmlFor="aco" className="text-sm">
                    Aço
                  </label>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Preço</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="preco1"
                    className="mr-2"
                    checked={faixasPrecoSelecionadas.includes("0-100")}
                    onChange={() => toggleFaixaPreco("0-100")}
                  />
                  <label htmlFor="preco1" className="text-sm">
                    Até R$ 100
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="preco2"
                    className="mr-2"
                    checked={faixasPrecoSelecionadas.includes("100-300")}
                    onChange={() => toggleFaixaPreco("100-300")}
                  />
                  <label htmlFor="preco2" className="text-sm">
                    R$ 100 - R$ 300
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="preco3"
                    className="mr-2"
                    checked={faixasPrecoSelecionadas.includes("300-500")}
                    onChange={() => toggleFaixaPreco("300-500")}
                  />
                  <label htmlFor="preco3" className="text-sm">
                    R$ 300 - R$ 500
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="preco4"
                    className="mr-2"
                    checked={faixasPrecoSelecionadas.includes("500+")}
                    onChange={() => toggleFaixaPreco("500+")}
                  />
                  <label htmlFor="preco4" className="text-sm">
                    Acima de R$ 500
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Button variant="outline" className="w-full rounded-none" onClick={limparFiltros}>
                Limpar Filtros
              </Button>
              <Button className="w-full rounded-none" onClick={aplicarFiltros}>
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </div>

        {/* Produtos */}
        <div className="lg:col-span-3">
          {/* Filtros Mobile */}
          <div className="lg:hidden mb-6">
            <Button
              variant="outline"
              className="w-full flex items-center justify-between rounded-none"
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            >
              <span>Filtros</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${mobileFiltersOpen ? "rotate-180" : ""}`}
              />
            </Button>
          </div>

          {/* Filtros Mobile Expandidos */}
          {mobileFiltersOpen && (
            <div className="lg:hidden border p-4 mb-6 animate-in slide-in-from-top duration-300">
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Categorias</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="aneis-mobile"
                      className="mr-2"
                      checked={categoriasSelecionadas.includes("Anéis")}
                      onChange={() => toggleCategoria("Anéis")}
                    />
                    <label htmlFor="aneis-mobile" className="text-sm">
                      Anéis
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="brincos-mobile"
                      className="mr-2"
                      checked={categoriasSelecionadas.includes("Brincos")}
                      onChange={() => toggleCategoria("Brincos")}
                    />
                    <label htmlFor="brincos-mobile" className="text-sm">
                      Brincos
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="colares-mobile"
                      className="mr-2"
                      checked={categoriasSelecionadas.includes("Colares")}
                      onChange={() => toggleCategoria("Colares")}
                    />
                    <label htmlFor="colares-mobile" className="text-sm">
                      Colares
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="pulseiras-mobile"
                      className="mr-2"
                      checked={categoriasSelecionadas.includes("Pulseiras")}
                      onChange={() => toggleCategoria("Pulseiras")}
                    />
                    <label htmlFor="pulseiras-mobile" className="text-sm">
                      Pulseiras
                    </label>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Material</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="ouro-mobile"
                      className="mr-2"
                      checked={materiaisSelecionados.includes("Ouro")}
                      onChange={() => toggleMaterial("Ouro")}
                    />
                    <label htmlFor="ouro-mobile" className="text-sm">
                      Ouro
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="prata-mobile"
                      className="mr-2"
                      checked={materiaisSelecionados.includes("Prata")}
                      onChange={() => toggleMaterial("Prata")}
                    />
                    <label htmlFor="prata-mobile" className="text-sm">
                      Prata
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="aco-mobile"
                      className="mr-2"
                      checked={materiaisSelecionados.includes("Aço")}
                      onChange={() => toggleMaterial("Aço")}
                    />
                    <label htmlFor="aco-mobile" className="text-sm">
                      Aço
                    </label>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Preço</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="preco1-mobile"
                      className="mr-2"
                      checked={faixasPrecoSelecionadas.includes("0-100")}
                      onChange={() => toggleFaixaPreco("0-100")}
                    />
                    <label htmlFor="preco1-mobile" className="text-sm">
                      Até R$ 100
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="preco2-mobile"
                      className="mr-2"
                      checked={faixasPrecoSelecionadas.includes("100-300")}
                      onChange={() => toggleFaixaPreco("100-300")}
                    />
                    <label htmlFor="preco2-mobile" className="text-sm">
                      R$ 100 - R$ 300
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="preco3-mobile"
                      className="mr-2"
                      checked={faixasPrecoSelecionadas.includes("300-500")}
                      onChange={() => toggleFaixaPreco("300-500")}
                    />
                    <label htmlFor="preco3-mobile" className="text-sm">
                      R$ 300 - R$ 500
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="preco4-mobile"
                      className="mr-2"
                      checked={faixasPrecoSelecionadas.includes("500+")}
                      onChange={() => toggleFaixaPreco("500+")}
                    />
                    <label htmlFor="preco4-mobile" className="text-sm">
                      Acima de R$ 500
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" className="w-1/2 rounded-none" onClick={limparFiltros}>
                  Limpar
                </Button>
                <Button className="w-1/2 rounded-none" onClick={aplicarFiltros}>
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          )}

          {/* Ordenação */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-muted-foreground">{produtosFiltrados.length} produtos</p>
            <div className="flex items-center">
              <span className="text-sm mr-2">Ordenar por:</span>
              <select
                className="text-sm border p-1"
                value={ordenacaoSelecionada}
                onChange={(e) => setOrdenacaoSelecionada(e.target.value as OrdenacaoOpcao)}
              >
                <option value="recentes">Mais recentes</option>
                <option value="preco-asc">Preço: menor para maior</option>
                <option value="preco-desc">Preço: maior para menor</option>
                <option value="nome-asc">Nome: A-Z</option>
              </select>
            </div>
          </div>

          {/* Grid de Produtos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {produtosFiltrados.length > 0 ? (
              produtosFiltrados.map((produto) => <ProductCard key={produto.id} produto={produto} />)
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-lg font-light mb-4">Nenhum produto encontrado</p>
                <p className="text-sm text-muted-foreground mb-6">
                  Tente ajustar os filtros para encontrar o que procura.
                </p>
                <Button variant="outline" className="rounded-none" onClick={limparFiltros}>
                  Limpar Filtros
                </Button>
              </div>
            )}
          </div>

          {/* Paginação - Só mostrar se houver produtos */}
          {produtosFiltrados.length > 0 && (
            <div className="flex justify-center mt-12">
              <div className="flex space-x-1">
                <Button variant="outline" size="sm" className="rounded-none w-10 h-10">
                  1
                </Button>
                <Button variant="ghost" size="sm" className="rounded-none w-10 h-10">
                  2
                </Button>
                <Button variant="ghost" size="sm" className="rounded-none w-10 h-10">
                  3
                </Button>
                <Button variant="ghost" size="sm" className="rounded-none w-10 h-10">
                  4
                </Button>
                <Button variant="ghost" size="sm" className="rounded-none w-10 h-10">
                  5
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
