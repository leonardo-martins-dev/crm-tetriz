import { NextResponse } from 'next/server'

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const instanceName = searchParams.get('instance')

    if (!instanceName) {
      return NextResponse.json({ error: 'Instance name is required' }, { status: 400 })
    }

    const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'http://localhost:8080'
    const GLOBAL_API_KEY = process.env.EVOLUTION_API_KEY || 'mude-me'

    const url = `${EVOLUTION_API_URL}/instance/logout/${instanceName}`
    const responseLogout = await fetch(url, {
      method: 'DELETE',
      headers: { apikey: GLOBAL_API_KEY },
    })
    
    // Ignoramos 404 se a instancia jah nao existe / n esta logada
    if (!responseLogout.ok && responseLogout.status !== 404) {
        // Apenas logamos e tentamos deletar de fato a instancia
        console.warn('Falha no logout da instancia', await responseLogout.text());
    }

    const deleteUrl = `${EVOLUTION_API_URL}/instance/delete/${instanceName}`
    const responseDelete = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: { apikey: GLOBAL_API_KEY },
    })

    // TODO: Marcar como 'inactive' no Supabase.

    if (!responseDelete.ok && responseDelete.status !== 404) {
      const errorBody = await responseDelete.text()
      return NextResponse.json(
        { error: 'Failed to delete instance', details: errorBody },
        { status: responseDelete.status }
      )
    }

    return NextResponse.json({ success: true, message: 'Instance deleted' })
  } catch (error) {
    console.error('Erro na API de deletar:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
