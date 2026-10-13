import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hoverEffect?: boolean
}

export function Card({ children, className = '', hoverEffect = false, ...props }: CardProps) {
  return (
    <div 
      className={`bg-card-bg border border-border-color rounded-xl overflow-hidden transition-all duration-300 ${
        hoverEffect ? 'hover:border-primary-cyan hover:shadow-[0_0_15px_rgba(0,217,255,0.15)]' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`p-6 border-b border-border-color ${className}`}>
      {children}
    </div>
  )
}

export function CardContent({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`p-6 border-t border-border-color ${className}`}>
      {children}
    </div>
  )
}
