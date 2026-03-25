'use client'

import { Node, nodeTemplates } from '@/lib/stores/automationFlowStore'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

interface FlowNodeProps {
  node: Node
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
  onMouseDown: (nodeId: string) => (e: React.MouseEvent) => void
  onDragStart: (e: React.DragEvent) => void
  onConnectStart: (nodeId: string) => (e: React.MouseEvent) => void
  onConnectEnd: (nodeId: string) => (e: React.MouseEvent) => void
}

export function FlowNode({
  node,
  isSelected,
  onSelect,
  onDelete,
  onMouseDown,
  onDragStart,
  onConnectStart,
  onConnectEnd,
}: FlowNodeProps) {
  const template = nodeTemplates[node.type]

  return (
    <div
      data-node-id={node.id}
      className="absolute cursor-move select-none"
      style={{
        left: node.position.x,
        top: node.position.y,
      }}
      draggable={false}
      onMouseDown={onMouseDown(node.id)}
      onDragStart={onDragStart}
      onClick={(e) => {
        // Só seleciona se não estiver arrastando
        if (!e.defaultPrevented) {
          onSelect()
        }
      }}
    >
      <div
        className={cn(
          'relative rounded-lg border-2 bg-card shadow-lg transition-all hover:shadow-xl',
          isSelected ? 'border-primary' : 'border-border'
        )}
        style={{ minWidth: '180px' }}
      >
        {/* Header */}
        <div
          className={cn(
            'flex items-center gap-2 rounded-t-lg px-3 py-2 text-white',
            template.color
          )}
        >
          <span className="text-lg">{template.icon}</span>
          <span className="flex-1 text-sm font-semibold">{template.label}</span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="rounded p-0.5 hover:bg-white/20"
          >
            <X className="h-3 w-3" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3">
          <p className="text-xs text-muted-foreground">{node.label}</p>
        </div>

        {/* Connection Points */}
        <div className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 gap-2">
          {/* Output point */}
          <div
            className="h-4 w-4 cursor-crosshair rounded-full border-2 border-primary bg-background hover:bg-primary z-10"
            onMouseDown={(e) => {
              e.stopPropagation()
              onConnectStart(node.id)(e)
            }}
            title="Conectar"
          />
        </div>
        <div className="absolute -top-2 left-1/2 flex -translate-x-1/2 gap-2">
          {/* Input point */}
          <div
            className="h-4 w-4 cursor-crosshair rounded-full border-2 border-green-500 bg-background hover:bg-green-500 z-10"
            onMouseDown={(e) => {
              e.stopPropagation()
              onConnectEnd(node.id)(e)
            }}
            title={node.connections.length > 0 ? 'Desconectar' : 'Conectar'}
          />
        </div>
      </div>
    </div>
  )
}

