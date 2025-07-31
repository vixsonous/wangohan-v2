"use client";

import { useState } from "react";

interface StarReviewsProps {
  value: number, 
  interactive?: boolean, 
  large?: boolean
}

export default function StarReviews({
  value,
  interactive=false,
  large=false
}: StarReviewsProps) {

  const [state, setState] = useState({
    starVal: value,
    constVal: value
  });
  
  return (
    <form className="flex items-center">
      {
        Array.from(Array(5).keys()).map( a => {
          return (
            <svg 
              onClick={(e) => setState(prev => ({...prev, constVal: 1}))} 
              onMouseLeave={(e) => setState(prev => ({...prev, starVal: prev.constVal}))} 
              onMouseOver={(e) => setState(prev => ({...prev, starVal: 1}))}  
              key={a} 
              className={`${large ? 'w-4 h-4': 'w-[10px] h-[10px]'} 
              ${value > a ? 'text-yellow-300' : 'text-gray-300 dark:text-gray-500'} ms-1`} 
              aria-hidden="true" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="currentColor" 
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" strokeWidth="0.5" stroke="grey"/>
            </svg>
          )
        })
      }
      {
        interactive && (
          <input 
            type="text" 
            value={state.constVal} 
            onChange={(e) => {
              setState(prev => ({...prev, constVal: prev.constVal}))
            }} 
            className="hidden" 
            name="rating"
          />
        )
      }
    </form>
  )
}