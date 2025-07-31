import React, { ButtonHTMLAttributes } from "react"

const Button = React.forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  ({children, ...props}, ref) => {
    return (
      <button {...props} className={`cursor-pointer hover:brightness-80 transition-all duration-200 ` + props.className} ref={ref}>
        {children}
      </button>
    )
  }
)

Button.displayName = "Button";

export default Button;