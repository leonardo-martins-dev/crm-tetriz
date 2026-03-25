'use client'

import { ReactNode, useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface DropdownMenuProps {
  children: ReactNode
  align?: 'start' | 'end'
}

export function DropdownMenu({ children, align = 'end' }: DropdownMenuProps) {
  return <div className="relative inline-block">{children}</div>
}

interface DropdownMenuTriggerProps {
  asChild?: boolean
  children: ReactNode
}

export function DropdownMenuTrigger({ asChild, children }: DropdownMenuTriggerProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen(!open)}>{children}</div>
      {open && (
        <div className="absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
          {(children as any).props?.children}
        </div>
      )}
    </div>
  )
}

interface DropdownMenuContentProps {
  children: ReactNode
  align?: 'start' | 'end'
  className?: string
}

export function DropdownMenuContent({ children, align = 'end', className }: DropdownMenuContentProps) {
  return (
    <div
      className={cn(
        'min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
        align === 'start' ? 'left-0' : 'right-0',
        className
      )}
    >
      {children}
    </div>
  )
}

interface DropdownMenuItemProps {
  children: ReactNode
  onClick?: () => void
  className?: string
}

export function DropdownMenuItem({ children, onClick, className }: DropdownMenuItemProps) {
  return (
    <div
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

