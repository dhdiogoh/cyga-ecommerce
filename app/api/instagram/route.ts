import { NextResponse } from "next/server"

// Constantes para a API do Instagram
const INSTAGRAM_API_URL = "https://graph.instagram.com"

export async function GET() {
  try {
    // O token de acesso deve ser armazenado como variável de ambiente
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN

    if (!accessToken) {
      // Retornar um erro específico quando o token não estiver configurado
      return NextResponse.json(
        { error: "Token de acesso do Instagram não configurado", code: "TOKEN_MISSING" },
        { status: 503 },
      )
    }

    // Buscar as mídias do Instagram
    const response = await fetch(
      `${INSTAGRAM_API_URL}/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${accessToken}`,
      { next: { revalidate: 3600 } }, // Revalidar a cada hora
    )

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { error: "Erro ao buscar dados do Instagram", details: error },
        { status: response.status },
      )
    }

    const data = await response.json()

    // Filtrar apenas as imagens (excluir vídeos)
    const images = data.data
      .filter((item: any) => item.media_type === "IMAGE" || item.media_type === "CAROUSEL_ALBUM")
      .slice(0, 8) // Limitar a 8 imagens

    return NextResponse.json(images)
  } catch (error) {
    console.error("Erro ao buscar dados do Instagram:", error)
    return NextResponse.json({ error: "Erro ao processar a requisição" }, { status: 500 })
  }
}
