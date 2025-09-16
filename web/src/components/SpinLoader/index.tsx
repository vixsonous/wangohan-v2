"use client";

import Image from "@/components/Image/client";
import React from "react";

export default function SpinLoader() {
  return (
    <Image alt={"circle loading svg"} src={"/icons/svg/primary-loading.svg"} noprocess={true} className={"animate-spin"} />
  )
}