import React from 'react'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default'
  children: React.ReactNode
}

export function Badge({ variant = 'default', className = '', children, ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
  
  const variants = {
    default: "bg-elevated-surface text-secondary-text border-border-color",
    success: "bg-[#38F59B]/10 text-[#38F59B] border-[#38F59B]/30",
    warning: "bg-[#FFD58A]/10 text-[#FFD58A] border-[#FFD58A]/30",
    error: "bg-[#FF5C7A]/10 text-[#FF5C7A] border-[#FF5C7A]/30",
    info: "bg-[#00D9FF]/10 text-[#00D9FF] border-[#00D9FF]/30",
  }
  
  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  )
}
