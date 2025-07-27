import React from "react";

export default function Error({children}: {children: React.ReactNode}) {
  return (
    <span className="text-xs text-error flex items-center gap-2 mt-1">
      {children}
    </span>
  )
}