import React from 'react'
import { Checkbox } from "@/components/ui/checkbox";

export const Alert = ({ children, variant = 'default' }) => {
  const baseStyles = 'p-4 rounded-md mb-4'
  const variantStyles = {
    default: 'bg-blue-100 text-blue-700',
    destructive: 'bg-red-100 text-red-700',
  }

  return (
    <div className={`${baseStyles} ${variantStyles[variant]}`}>
      {children}
    </div>
  )
}

export const AlertDescription = ({ children }) => {
  return <p className="text-sm">{children}</p>
}