import React, { HTMLAttributes } from "react"

const Button = React.forwardRef<HTMLButtonElement, HTMLAttributes<HTMLButtonElement>>(
  ({children, ...props}, ref) => {
    return (
      <button {...props} className={`cursor-pointer ` + props.className} ref={ref}>
        {children}
      </button>
    )
  }
)

Button.displayName = "Button";

export default Button;