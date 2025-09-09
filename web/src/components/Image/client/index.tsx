/* eslint-disable @next/next/no-img-element */
"use client";
import React, { ImgHTMLAttributes } from "react";

interface ImageProps {
  noprocess?: boolean,
  dpr?: number;
  fit?: "cover"
}

export default function Image({src, dpr=1.5, width, height, fit, noprocess=false, alt, ...props}: ImgHTMLAttributes<HTMLImageElement> & ImageProps) {
  let url = src;
  if(!noprocess || String(url).startsWith("r2://")) {
    url = process.env.NEXT_PUBLIC_ORIGIN + "/api/transform-image?src=" + src;
    url = width ? url + "&w=" + Math.floor((Number(width) * dpr)) : url;
    url = height ? url + "&h=" + Math.floor((Number(height) * dpr)) : url;
    url = fit ? url + "&fit=" + fit : url;
  }

  return (
    <img {...props} width={width} height={height} src={url} alt={alt || "undescribed image"} />
  )
}
