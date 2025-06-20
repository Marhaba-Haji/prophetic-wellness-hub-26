import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, helperText, ...props }, ref) => {
    const inputId = React.useId()
    
    return (
      <div className="relative w-full">
        <input
          type={type}
          id={inputId}
          aria-invalid={error}
          aria-describedby={helperText ? `${inputId}-helper` : undefined}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-colors duration-200",
            error && "border-destructive focus-visible:ring-destructive",
            "md:text-sm",
            className
          )}
          ref={ref}
          {...props}
        />
        {helperText && (
          <p
            id={`${inputId}-helper`}
            className={cn(
              "mt-1 text-sm",
              error ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
