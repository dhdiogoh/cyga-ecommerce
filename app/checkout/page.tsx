"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function CheckoutPage() {
  const [showPrayerDialog, setShowPrayerDialog] = useState(false)
  const [prayerRequest, setPrayerRequest] = useState("")
  const [orderCompleted, setOrderCompleted] = useState(false)

  const handleFinishOrder = () => {
    // Aqui você adicionaria a lógica para processar o pedido
    // Por enquanto, apenas mostramos o diálogo de oração
    setShowPrayerDialog(true)
  }

  const handleSubmitPrayer = () => {
    // Aqui você adicionaria a lógica para salvar o pedido de oração
    setShowPrayerDialog(false)
    setOrderCompleted(true)
  }

  const handleSkipPrayer = () => {
    // Apenas fecha o diálogo e mostra a confirmação do pedido
    setShowPrayerDialog(false)
    setOrderCompleted(true)
  }

  if (orderCompleted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-16 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-green-100 text-green-800 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 md:h-8 md:w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-light mb-3 md:mb-4">Pedido Confirmado!</h1>
          <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8 px-2">
            Seu pedido foi recebido e está sendo processado. Você receberá um e-mail com os detalhes da sua compra.
          </p>
          {prayerRequest && (
            <div className="mb-6 md:mb-8 p-3 md:p-4 bg-neutral-50 inline-block max-w-full mx-4">
              <p className="text-xs md:text-sm italic">
                "Recebemos seu pedido de oração. Nossa equipe estará orando por você."
              </p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 mt-6 md:mt-8 px-4">
            <Button asChild variant="outline" className="rounded-none text-xs md:text-sm">
              <Link href="/produtos">Continuar Comprando</Link>
            </Button>
            <Button asChild className="rounded-none text-xs md:text-sm">
              <Link href="/conta">Minha Conta</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-light text-center mb-8 md:mb-12">CHECKOUT</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        {/* Formulário de Checkout */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {/* Informações Pessoais */}
          <div>
            <h2 className="text-lg md:text-xl font-light mb-3 md:mb-4">Informações Pessoais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div className="space-y-1 md:space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" placeholder="Seu nome" />
              </div>
              <div className="space-y-1 md:space-y-2">
                <Label htmlFor="sobrenome">Sobrenome</Label>
                <Input id="sobrenome" placeholder="Seu sobrenome" />
              </div>
              <div className="space-y-1 md:space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="seu@email.com" />
              </div>
              <div className="space-y-1 md:space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" placeholder="(00) 00000-0000" />
              </div>
              <div className="space-y-1 md:space-y-2 md:col-span-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input id="cpf" placeholder="000.000.000-00" />
              </div>
            </div>
          </div>

          <Separator />

          {/* Endereço de Entrega */}
          <div>
            <h2 className="text-lg md:text-xl font-light mb-3 md:mb-4">Endereço de Entrega</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div className="space-y-1 md:space-y-2 md:col-span-2">
                <Label htmlFor="cep">CEP</Label>
                <div className="flex">
                  <Input id="cep" placeholder="00000-000" className="flex-grow" />
                  <Button variant="outline" className="ml-2 rounded-none">
                    Buscar
                  </Button>
                </div>
              </div>
              <div className="space-y-1 md:space-y-2 md:col-span-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input id="endereco" placeholder="Rua, Avenida, etc." />
              </div>
              <div className="space-y-1 md:space-y-2">
                <Label htmlFor="numero">Número</Label>
                <Input id="numero" placeholder="123" />
              </div>
              <div className="space-y-1 md:space-y-2">
                <Label htmlFor="complemento">Complemento</Label>
                <Input id="complemento" placeholder="Apto, Bloco, etc." />
              </div>
              <div className="space-y-1 md:space-y-2">
                <Label htmlFor="bairro">Bairro</Label>
                <Input id="bairro" placeholder="Seu bairro" />
              </div>
              <div className="space-y-1 md:space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input id="cidade" placeholder="Sua cidade" />
              </div>
              <div className="space-y-1 md:space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <select id="estado" className="w-full border p-2 rounded-md">
                  <option value="">Selecione</option>
                  <option value="SP">São Paulo</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="MG">Minas Gerais</option>
                  {/* Outros estados */}
                </select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Método de Entrega */}
          <div>
            <h2 className="text-lg md:text-xl font-light mb-3 md:mb-4">Método de Entrega</h2>
            <RadioGroup defaultValue="padrao">
              <div className="flex items-center space-x-2 border p-3 md:p-4 mb-2">
                <RadioGroupItem value="padrao" id="padrao" />
                <Label htmlFor="padrao" className="flex-grow text-sm md:text-base">
                  <div className="flex justify-between">
                    <span>Entrega Padrão (3-5 dias úteis)</span>
                    <span>R$ 19,90</span>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border p-3 md:p-4 mb-2">
                <RadioGroupItem value="expressa" id="expressa" />
                <Label htmlFor="expressa" className="flex-grow text-sm md:text-base">
                  <div className="flex justify-between">
                    <span>Entrega Expressa (1-2 dias úteis)</span>
                    <span>R$ 39,90</span>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Método de Pagamento */}
          <div>
            <h2 className="text-lg md:text-xl font-light mb-3 md:mb-4">Método de Pagamento</h2>
            <RadioGroup defaultValue="cartao">
              <div className="flex items-center space-x-2 border p-3 md:p-4 mb-2">
                <RadioGroupItem value="cartao" id="cartao" />
                <Label htmlFor="cartao" className="flex-grow text-sm md:text-base">
                  Cartão de Crédito
                </Label>
              </div>

              <div className="ml-4 md:ml-6 mb-4 space-y-3 md:space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div className="space-y-1 md:space-y-2 md:col-span-2">
                    <Label htmlFor="cartao_numero">Número do Cartão</Label>
                    <Input id="cartao_numero" placeholder="0000 0000 0000 0000" />
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <Label htmlFor="cartao_nome">Nome no Cartão</Label>
                    <Input id="cartao_nome" placeholder="Nome como está no cartão" />
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <Label htmlFor="cartao_validade">Validade</Label>
                    <Input id="cartao_validade" placeholder="MM/AA" />
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <Label htmlFor="cartao_cvv">CVV</Label>
                    <Input id="cartao_cvv" placeholder="123" />
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <Label htmlFor="cartao_parcelas">Parcelas</Label>
                    <select id="cartao_parcelas" className="w-full border p-2 rounded-md text-sm md:text-base">
                      <option value="1">1x de R$ 679,70 sem juros</option>
                      <option value="2">2x de R$ 339,85 sem juros</option>
                      <option value="3">3x de R$ 226,57 sem juros</option>
                      <option value="4">4x de R$ 169,93 sem juros</option>
                      <option value="5">5x de R$ 135,94 sem juros</option>
                      <option value="6">6x de R$ 113,28 sem juros</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 border p-3 md:p-4 mb-2">
                <RadioGroupItem value="boleto" id="boleto" />
                <Label htmlFor="boleto" className="flex-grow text-sm md:text-base">
                  Boleto Bancário
                </Label>
              </div>

              <div className="flex items-center space-x-2 border p-3 md:p-4 mb-2">
                <RadioGroupItem value="pix" id="pix" />
                <Label htmlFor="pix" className="flex-grow text-sm md:text-base">
                  PIX
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Resumo do Pedido */}
        <div>
          <div className="border p-4 md:p-6 sticky top-24">
            <h2 className="text-lg font-medium mb-3 md:mb-4">Resumo do Pedido</h2>

            {/* Itens */}
            <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
              <div className="flex gap-3 md:gap-4">
                <div className="relative w-14 h-14 md:w-16 md:h-16 flex-shrink-0">
                  <Image
                    src="/placeholder.svg?height=200&width=200"
                    alt="Anel Solitário Elegance"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="text-xs md:text-sm font-medium">Anel Solitário Elegance</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">Quantidade: 1</p>
                  <p className="text-xs md:text-sm">R$ 299,90</p>
                </div>
              </div>

              <div className="flex gap-3 md:gap-4">
                <div className="relative w-14 h-14 md:w-16 md:h-16 flex-shrink-0">
                  <Image
                    src="/placeholder.svg?height=200&width=200"
                    alt="Colar Pérolas Delicadas"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="text-xs md:text-sm font-medium">Colar Pérolas Delicadas</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">Quantidade: 2</p>
                  <p className="text-xs md:text-sm">R$ 379,80</p>
                </div>
              </div>
            </div>

            <Separator className="my-3 md:my-4" />

            {/* Valores */}
            <div className="space-y-1 md:space-y-2 mb-3 md:mb-4 text-sm md:text-base">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>R$ 679,70</span>
              </div>
              <div className="flex justify-between">
                <span>Frete</span>
                <span>R$ 19,90</span>
              </div>
            </div>

            <Separator className="my-3 md:my-4" />

            <div className="flex justify-between font-medium text-base md:text-lg mb-4 md:mb-6">
              <span>Total</span>
              <span>R$ 699,60</span>
            </div>

            <Button className="w-full rounded-none h-10 md:h-12 text-xs md:text-sm" onClick={handleFinishOrder}>
              FINALIZAR COMPRA
            </Button>

            <div className="mt-4 md:mt-6 text-xs md:text-sm text-center text-muted-foreground">
              <p>Ao finalizar a compra, você concorda com nossos</p>
              <div className="flex justify-center space-x-1">
                <Link href="/termos" className="underline">
                  Termos de Serviço
                </Link>
                <span>e</span>
                <Link href="/privacidade" className="underline">
                  Política de Privacidade
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Diálogo de Oração */}
      <Dialog open={showPrayerDialog} onOpenChange={setShowPrayerDialog}>
        <DialogContent className="sm:max-w-md max-w-[90vw] p-4 md:p-6 rounded-lg">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-center text-lg md:text-xl font-light">Podemos orar por você?</DialogTitle>
            <DialogDescription className="text-center text-xs md:text-sm">
              Compartilhe conosco seu pedido de oração. Nossa equipe terá o privilégio de interceder por você.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 md:py-4">
            <Textarea
              placeholder="Digite seu pedido de oração aqui (opcional)"
              className="min-h-[80px] md:min-h-[100px] text-sm"
              value={prayerRequest}
              onChange={(e) => setPrayerRequest(e.target.value)}
            />
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="sm:w-1/2 h-10 text-xs md:text-sm" onClick={handleSkipPrayer}>
              Pular
            </Button>
            <Button className="sm:w-1/2 h-10 text-xs md:text-sm" onClick={handleSubmitPrayer}>
              Enviar Pedido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
