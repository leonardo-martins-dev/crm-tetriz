import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

export function Card({ 
  children, 
  className,
  ...props 
}: { 
  children: React.ReactNode
  className?: string
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('flex flex-col space-y-1.5 p-6', className)}>{children}</div>
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn('text-2xl font-semibold leading-none tracking-tight', className)}>{children}</h3>
}

export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('text-sm text-muted-foreground', className)}>{children}</p>
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('p-6 pt-0', className)}>{children}</div>
}

