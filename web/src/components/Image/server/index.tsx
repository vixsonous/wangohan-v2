/* eslint-disable @next/next/no-img-element */
import { ServerUtils } from "@/lib/server-utils";
import Head from "next/head";
import React, { ImgHTMLAttributes } from "react";

interface ImageProps {
  noprocess?: boolean,
  preload?: boolean,
  dpr?: number;
}

export default async function Image({src, dpr=1.5, width, height, noprocess=false, preload=false, alt, ...props}: ImgHTMLAttributes<HTMLImageElement> & ImageProps) {
  let url = src;
  if(!noprocess) {
    url = "http://localhost:3001/api/transform-image?src=" + src;
    url = width ? url + "&w=" + Math.floor((Number(width) * dpr)) : url;
    url = height ? url + "&h=" + Math.floor((Number(height) * dpr)) : url;
  }

  if(preload && typeof url === 'string') {
    ServerUtils.registerPreload(url);
  }

  return (
    <img {...props} width={width} height={height} src={url} alt={alt || "undescribed image"} />
  )
}
