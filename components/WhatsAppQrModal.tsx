'use client'

import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { WhatsAppIcon } from '@/components/WhatsAppIcon'
import { Loader2, RefreshCw } from 'lucide-react'
import Image from 'next/image'

interface WhatsAppQrModalProps {
  isOpen: boolean
  onClose: () => void
  qrCodeBase64?: string
  pairingCode?: string
  isConnecting?: boolean
  onRefreshQr?: () => void
}

export function WhatsAppQrModal({
  isOpen,
  onClose,
  qrCodeBase64,
  pairingCode,
  isConnecting = true,
  onRefreshQr,
}: WhatsAppQrModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Conectar WhatsApp" size="sm">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full text-white">
          <WhatsAppIcon className="w-8 h-8" />
        </div>

        <div>
          <h3 className="text-lg font-semibold">1. Abra o WhatsApp no seu celular</h3>
          <p className="text-sm text-muted-foreground mt-2">
            2. Toque em <strong>Mais opções</strong> (três pontos) ou <strong>Configurações</strong><br />
            3. Toque em <strong>Aparelhos conectados</strong><br />
            4. Toque em <strong>Conectar um aparelho</strong><br />
            5. Aponte seu celular para esta tela para capturar o código
          </p>
        </div>

        <div className="relative p-4 bg-white rounded-xl border-2 border-dashed border-border w-64 h-64 flex items-center justify-center">
          {qrCodeBase64 ? (
            <Image 
              src={qrCodeBase64} 
              alt="QR Code do WhatsApp" 
              width={224} 
              height={224}
              className="rounded"
            />
          ) : (
            <div className="flex flex-col items-center text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <span className="text-sm">Gerando código...</span>
            </div>
          )}
        </div>

        {pairingCode && (
          <div className="text-sm">
            <p className="text-muted-foreground">Ou conecte usando o código:</p>
            <p className="font-mono text-xl font-bold tracking-widest mt-1 bg-muted px-4 py-2 rounded-lg">
              {pairingCode}
            </p>
          </div>
        )}

        <div className="w-full space-y-3">
          {isConnecting && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/50 py-2 rounded-lg">
              <Loader2 className="w-4 h-4 animate-spin text-green-500" />
              Aguardando leitura do código...
            </div>
          )}

          <Button 
            variant="outline" 
            className="w-full" 
            onClick={onRefreshQr}
            disabled={!qrCodeBase64}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Gerar novo código
          </Button>
        </div>
      </div>
    </Modal>
  )
}
