import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'cta' | 'ghost' | 'outline' | 'success' | 'error'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  children, 
  ...props 
}: ButtonProps) {
  
  const baseStyles = "inline-flex items-center justify-center font-bold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-main-bg disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "bg-primary-cyan text-main-bg hover:bg-[#33e0ff] hover:shadow-[0_0_15px_rgba(0,217,255,0.4)] focus:ring-primary-cyan",
    secondary: "bg-transparent border border-neon-blue text-primary-text hover:shadow-[0_0_15px_rgba(57,123,255,0.4)] focus:ring-neon-blue",
    cta: "bg-gradient-to-r from-primary-cyan to-neon-blue text-main-bg hover:shadow-[0_0_20px_rgba(0,217,255,0.5)] focus:ring-primary-cyan",
    ghost: "bg-transparent text-secondary-text hover:text-primary-text hover:bg-elevated-surface focus:ring-border-color",
    outline: "bg-transparent border border-border-color text-primary-text hover:bg-elevated-surface focus:ring-border-color",
    success: "bg-[#38F59B] text-black hover:bg-[#2dd482] hover:shadow-[0_0_15px_rgba(56,245,155,0.4)] focus:ring-[#38F59B]",
    error: "bg-[#FF5C7A] text-white hover:bg-[#e04563] hover:shadow-[0_0_15px_rgba(255,92,122,0.4)] focus:ring-[#FF5C7A]"
  }
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  }
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
