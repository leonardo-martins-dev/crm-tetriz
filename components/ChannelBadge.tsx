import { Channel } from '@/types'
import { Badge } from './ui/Badge'
import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChannelBadgeProps {
  channel: Channel
  className?: string
}

const channelConfig = {
  whatsapp: {
    label: 'WhatsApp',
    icon: MessageCircle,
    color: 'bg-green-500',
  },
}

export function ChannelBadge({ channel, className }: ChannelBadgeProps) {
  const config = channelConfig[channel]
  const Icon = config.icon

  return (
    <Badge
      variant="info"
      className={cn('gap-1.5', className)}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  )
}

