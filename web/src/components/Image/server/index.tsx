/* eslint-disable @next/next/no-img-element */
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
    url = width ? url + "&w=" + (Number(width) * dpr) : url;
    url = height ? url + "&h=" + (Number(height) * dpr) : url;
  }

  return (
    <>
    {preload && typeof url === 'string' ? (
      <Head>
        <link rel="preload" href={url} as="image"/>
      </Head>
    ) : undefined}
    <img {...props} width={width} height={height} src={url} alt={alt || "undescribed image"} />
    </>
  )
}
