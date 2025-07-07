"use client";

import Button from "@/components/Button";
import React from "react";


function scroll(id: string, duration: number) { 
  const el = document.querySelector(id);
  if(!el) return;
  const elementY = (el.getBoundingClientRect().top - document.body.getBoundingClientRect().top) - 65;
  const startingY = window.scrollY;
  const diff = elementY - startingY;
  let start = 0;

  // Bootstrap our animation - it will get called right before next frame shall be rendered.
  window.requestAnimationFrame(function step(timestamp) {
    if (start === 0) start = timestamp;
    // Elapsed milliseconds since start of scrolling.
    const time = timestamp - start;
    
    // Get percent of completion in range [0, 1].
    const percent = Math.min(time / duration, 1);

    window.scrollTo(0, startingY + diff * percent);

    // Proceed with animation as long as we wanted it to.
    if (time < duration) {
      window.requestAnimationFrame(step);
    }
  })
}

export default function GotoSearchCategoriesBtn() {

  const gotoCategories = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    scroll("#category", 200);
  }
  return (
    <Button
      onClick={gotoCategories}
      className="text-primary-text font-semibold hover:text-[#9ba3af]"
    >
      レシピを探す
    </Button>
  )
}