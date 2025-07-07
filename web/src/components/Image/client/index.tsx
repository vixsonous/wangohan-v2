/* eslint-disable @next/next/no-img-element */
"use client";
import React, { ImgHTMLAttributes } from "react";

interface ImageProps {
  noprocess?: boolean,
}

export default function Image({src, noprocess=false, alt, ...props}: ImgHTMLAttributes<HTMLImageElement> & ImageProps) {
  let url = src;
  
  if(!noprocess) {
    url = "http://localhost:3001/api/transform-image?src=" + src;
  }
  console.log(window.devicePixelRatio);
  return (
    <>
    <img {...props} src={url} alt={alt || "undescribed image"} />
    </>
  )
}
