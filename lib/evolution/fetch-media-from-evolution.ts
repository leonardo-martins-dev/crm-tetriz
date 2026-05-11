/**
 * Baixa mídia descriptografada via Evolution API (útil quando o webhook não traz URL pública).
 * POST /chat/getBase64FromMediaMessage/{instance}
 */
export async function evolutionGetBase64FromMediaMessage(
  instanceName: string,
  webMessage: Record<string, unknown>
): Promise<{ base64: string; mimetype: string } | null> {
  const base = (process.env.EVOLUTION_API_URL || '').replace(/\/$/, '')
  const apikey = process.env.EVOLUTION_API_KEY || ''
  if (!base || !apikey) return null

  try {
    const res = await fetch(
      `${base}/chat/getBase64FromMediaMessage/${encodeURIComponent(instanceName)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey },
        body: JSON.stringify({ message: webMessage }),
      }
    )
    if (!res.ok) {
      console.warn('[evolution media] HTTP', res.status, await res.text().then((t) => t.slice(0, 200)))
      return null
    }
    const j = (await res.json()) as { base64?: string; mimetype?: string }
    if (!j.base64 || typeof j.base64 !== 'string') return null
    const mimetype = (j.mimetype || 'application/octet-stream').split(';')[0].trim()
    return { base64: j.base64, mimetype }
  } catch (e) {
    console.warn('[evolution media]', e)
    return null
  }
}

export function fileExtensionForMime(mimetype: string): string {
  const m = mimetype.split(';')[0].trim().toLowerCase()
  if (m.includes('ogg')) return 'ogg'
  if (m.includes('opus')) return 'ogg'
  if (m.includes('mpeg') || m.includes('mp3')) return 'mp3'
  if (m.includes('mp4') || m.includes('m4a')) return 'm4a'
  if (m.includes('webm')) return 'webm'
  if (m.includes('wav')) return 'wav'
  if (m.includes('png')) return 'png'
  if (m.includes('jpeg') || m.includes('jpg')) return 'jpg'
  return 'bin'
}
