/* eslint-disable @next/next/no-img-element */
"use client";
import React, { ImgHTMLAttributes } from "react";

interface ImageProps {
  noprocess?: boolean,
  dpr?: number;
}

export default function Image({src, dpr=1.5, width, height, noprocess=false, alt, ...props}: ImgHTMLAttributes<HTMLImageElement> & ImageProps) {
  let url = src;
  if(!noprocess) {
    url = "http://localhost:3001/api/transform-image?src=" + src;
    url = width ? url + "&w=" + Math.floor((Number(width) * dpr)) : url;
    url = height ? url + "&h=" + Math.floor((Number(height) * dpr)) : url;
  }

  return (
    <img {...props} width={width} height={height} src={url} alt={alt || "undescribed image"} />
  )
}
