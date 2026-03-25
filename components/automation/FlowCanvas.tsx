'use client'

import { useRef, useState, useEffect } from 'react'
import { useAutomationFlowStore, Node, nodeTemplates, NodeType } from '@/lib/stores/automationFlowStore'
import { FlowNode } from './FlowNode'
import { Button } from '@/components/ui/Button'
import { Plus, Save, Play, Square } from 'lucide-react'

export function FlowCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const {
    currentFlow,
    selectedNodeId,
    addNode,
    updateNode,
    deleteNode,
    connectNodes,
    disconnectNodes,
    setSelectedNode,
    updateFlow,
  } = useAutomationFlowStore()

  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null)
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null)
  const mouseMoveRef = useRef<(e: MouseEvent) => void>()
  const mouseUpRef = useRef<() => void>()
  const [connectionLine, setConnectionLine] = useState<{ x: number; y: number } | null>(null)
  const [showNodeMenu, setShowNodeMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
  const addNodeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!currentFlow) {
      useAutomationFlowStore.getState().setCurrentFlow(useAutomationFlowStore.getState().flows[0]?.id || '')
    }
  }, [currentFlow])

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains('grid-background')) {
      setSelectedNode(null)
      setShowNodeMenu(false)
      setConnectingFrom(null)
      setConnectionLine(null)
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showNodeMenu && !(e.target as HTMLElement).closest('.node-menu')) {
        setShowNodeMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showNodeMenu])

  const handleCanvasContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      setMenuPosition({
        x: e.clientX,
        y: e.clientY,
      })
      setShowNodeMenu(true)
    }
  }

  const handleAddNode = (type: NodeType) => {
    if (canvasRef.current) {
      addNode(type, menuPosition)
      setShowNodeMenu(false)
    }
  }

  const handleNodeMouseDown = (nodeId: string) => (e: React.MouseEvent) => {
    if (e.button !== 0) return // Apenas botão esquerdo
    if (!canvasRef.current) return
    
    const node = currentFlow?.nodes.find((n) => n.id === nodeId)
    if (node && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const scrollLeft = canvasRef.current.scrollLeft
      const scrollTop = canvasRef.current.scrollTop
      const offsetX = e.clientX - rect.left + scrollLeft - node.position.x
      const offsetY = e.clientY - rect.top + scrollTop - node.position.y
      
      setDraggingNodeId(nodeId)
      setDragOffset({ x: offsetX, y: offsetY })
      e.preventDefault()
    }
  }

  const handleNodeDragStart = (nodeId: string) => (e: React.DragEvent) => {
    // Previne o drag padrão do HTML5
    e.preventDefault()
    e.stopPropagation()
  }

  const handleNodeDragEnd = () => {
    setDraggingNodeId(null)
    setDragOffset(null)
  }

  const handleConnectStart = (nodeId: string) => (e: React.MouseEvent) => {
    e.stopPropagation()
    setConnectingFrom(nodeId)
  }

  const handleConnectEnd = (nodeId: string) => (e: React.MouseEvent) => {
    e.stopPropagation()
    if (connectingFrom && connectingFrom !== nodeId) {
      connectNodes(connectingFrom, nodeId)
    }
    setConnectingFrom(null)
    setConnectionLine(null)
  }

  const handleMouseMove = (e: MouseEvent | React.MouseEvent) => {
    if (draggingNodeId && dragOffset && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const scrollLeft = canvasRef.current.scrollLeft
      const scrollTop = canvasRef.current.scrollTop
      const x = e.clientX - rect.left + scrollLeft - dragOffset.x
      const y = e.clientY - rect.top + scrollTop - dragOffset.y

      updateNode(draggingNodeId, {
        position: { x: Math.max(0, x), y: Math.max(0, y) },
      })
    } else if (connectingFrom && canvasRef.current && 'clientX' in e) {
      const rect = canvasRef.current.getBoundingClientRect()
      const scrollLeft = canvasRef.current.scrollLeft
      const scrollTop = canvasRef.current.scrollTop
      setConnectionLine({
        x: e.clientX - rect.left + scrollLeft,
        y: e.clientY - rect.top + scrollTop,
      })
    }
  }

  const handleMouseUp = () => {
    if (draggingNodeId) {
      setDraggingNodeId(null)
      setDragOffset(null)
    }
  }

  useEffect(() => {
    mouseMoveRef.current = handleMouseMove
    mouseUpRef.current = handleMouseUp
  })

  useEffect(() => {
    if (draggingNodeId) {
      const onMouseMove = (e: MouseEvent) => mouseMoveRef.current?.(e)
      const onMouseUp = () => {
        mouseUpRef.current?.()
      }
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
      return () => {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
      }
    }
  }, [draggingNodeId, dragOffset])

  const renderConnections = () => {
    if (!currentFlow) return null

    return currentFlow.nodes.map((node) =>
      node.connections.map((targetNodeId) => {
        const targetNode = currentFlow.nodes.find((n) => n.id === targetNodeId)
        if (!targetNode) return null

        const fromX = node.position.x + 90
        const fromY = node.position.y + 80
        const toX = targetNode.position.x + 90
        const toY = targetNode.position.y

        return (
          <svg
            key={`${node.id}-${targetNodeId}`}
            className="pointer-events-none absolute left-0 top-0 h-full w-full"
            style={{ zIndex: 0 }}
          >
            <path
              d={`M ${fromX} ${fromY} Q ${(fromX + toX) / 2} ${(fromY + toY) / 2} ${toX} ${toY}`}
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              fill="none"
              markerEnd="url(#arrowhead)"
            />
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="hsl(var(--primary))" />
              </marker>
            </defs>
          </svg>
        )
      })
    )
  }

  if (!currentFlow) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Nenhum fluxo selecionado</p>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full">
      {/* Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex gap-2 rounded-lg border bg-background p-2 shadow-lg">
        <Button
          ref={addNodeButtonRef}
          size="sm"
          variant="outline"
          onClick={(e) => {
            if (addNodeButtonRef.current) {
              const rect = addNodeButtonRef.current.getBoundingClientRect()
              setMenuPosition({
                x: rect.left,
                y: rect.bottom + 4,
              })
            }
            setShowNodeMenu(!showNodeMenu)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Nó
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => updateFlow({ active: !currentFlow.active })}
        >
          {currentFlow.active ? (
            <>
              <Square className="h-4 w-4 mr-2" />
              Desativar
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Ativar
            </>
          )}
        </Button>
        <Button size="sm" variant="outline">
          <Save className="h-4 w-4 mr-2" />
          Salvar
        </Button>
      </div>

      {/* Node Menu */}
      {showNodeMenu && (
        <div
          className="node-menu fixed z-20 rounded-lg border bg-popover p-2 shadow-lg"
          style={{
            left: menuPosition.x,
            top: menuPosition.y,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-1">
            {Object.entries(nodeTemplates).map(([type, template]) => (
              <button
                key={type}
                onClick={() => handleAddNode(type as NodeType)}
                className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm hover:bg-accent"
              >
                <span className="text-lg">{template.icon}</span>
                <span>{template.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="h-full w-full overflow-auto bg-muted/20"
        onClick={handleCanvasClick}
        onContextMenu={handleCanvasContextMenu}
        onMouseMove={handleMouseMove}
      >
        <div className="relative h-full w-full" style={{ minHeight: '1000px', minWidth: '1000px' }}>
          {/* Grid Background */}
          <div
            className="grid-background absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
            }}
          />

          {/* Connections */}
          {renderConnections()}

          {/* Connection Line Preview */}
          {connectingFrom && connectionLine && currentFlow.nodes.find((n) => n.id === connectingFrom) && (
            <svg
              className="pointer-events-none absolute left-0 top-0 h-full w-full"
              style={{ zIndex: 1 }}
            >
              <path
                d={`M ${currentFlow.nodes.find((n) => n.id === connectingFrom)!.position.x + 90} ${
                  currentFlow.nodes.find((n) => n.id === connectingFrom)!.position.y + 80
                } Q ${(currentFlow.nodes.find((n) => n.id === connectingFrom)!.position.x + 90 + connectionLine.x) / 2} ${
                  (currentFlow.nodes.find((n) => n.id === connectingFrom)!.position.y + 80 + connectionLine.y) / 2
                } ${connectionLine.x} ${connectionLine.y}`}
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeDasharray="5,5"
                fill="none"
              />
            </svg>
          )}

          {/* Nodes */}
          {currentFlow.nodes.map((node) => (
            <div key={node.id} data-node-id={node.id}>
              <FlowNode
                node={node}
                isSelected={selectedNodeId === node.id}
                onSelect={() => setSelectedNode(node.id)}
                onDelete={() => deleteNode(node.id)}
                onMouseDown={handleNodeMouseDown}
                onDragStart={handleNodeDragStart(node.id)}
                onConnectStart={handleConnectStart}
                onConnectEnd={handleConnectEnd}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

