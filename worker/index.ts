const ALLOWED_ORIGINS = new Set([
  'https://r2group.simulead.com.br',
  'http://localhost:5173',
])

function corsHeaders(origin: string | null): HeadersInit {
  const allowedOrigin = origin && ALLOWED_ORIGINS.has(origin) ? origin : 'https://r2group.simulead.com.br'

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  }
}

function json(body: unknown, status: number, origin: string | null): Response {
  return Response.json(body, { status, headers: corsHeaders(origin) })
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin')

    if (request.method === 'OPTIONS') {
      if (!origin || !ALLOWED_ORIGINS.has(origin)) return new Response(null, { status: 403 })
      return new Response(null, { status: 204, headers: corsHeaders(origin) })
    }

    if (request.method !== 'POST') return json({ error: 'Método não permitido.' }, 405, origin)
    if (!origin || !ALLOWED_ORIGINS.has(origin)) return json({ error: 'Origem não permitida.' }, 403, origin)

    const contentLength = Number(request.headers.get('Content-Length') || 0)
    if (contentLength > 16_384) return json({ error: 'Payload muito grande.' }, 413, origin)

    try {
      const payload = await request.json<Record<string, unknown>>()
      const required = ['objetivo', 'valor', 'entrada', 'parcela', 'prazo', 'nome', 'whatsapp', 'cidade']
      if (required.some(field => payload[field] === undefined || payload[field] === '')) {
        return json({ error: 'Dados obrigatórios ausentes.' }, 400, origin)
      }

      const convexPayload = {
        ...payload,
        telefone: payload.whatsapp,
        tipo: payload.objetivo,
      }

      const upstream = await fetch(env.CONVEX_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.CONVEX_WEBHOOK_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(convexPayload),
      })

      if (!upstream.ok) {
        console.error(JSON.stringify({ event: 'convex_webhook_error', status: upstream.status }))
        return json({ error: 'Não foi possível registrar o lead.' }, 502, origin)
      }

      return json({ success: true }, 200, origin)
    } catch (error) {
      console.error(JSON.stringify({ event: 'lead_proxy_error', message: error instanceof Error ? error.message : 'unknown' }))
      return json({ error: 'Requisição inválida.' }, 400, origin)
    }
  },
} satisfies ExportedHandler<Env>
