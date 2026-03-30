/**
 * Use case: Verificação de token do webhook pelo Meta.
 * O Meta faz um GET para validar nosso endpoint antes de registrar o webhook.
 */
export function verifyWebhook(params: {
  mode: string | null
  token: string | null
  challenge: string | null
  expectedVerifyToken: string
}): { status: number; body: string } {
  const { mode, token, challenge, expectedVerifyToken } = params

  if (mode === 'subscribe' && token === expectedVerifyToken) {
    return { status: 200, body: challenge || '' }
  }

  return { status: 403, body: 'Forbidden' }
}
