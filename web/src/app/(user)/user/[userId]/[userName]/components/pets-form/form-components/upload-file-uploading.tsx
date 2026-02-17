import Image from "@/components/Image/client";
import React from "react";

export default function UploadFileLoading () {
  return (
    <div className="absolute z-10 flex justify-center gap-2 items-center">
      <Image alt={"circle loading svg"} src={"/icons/svg/primary-loading.svg"} noprocess={true} className={"animate-spin"}/>
      <span>アップロード中...</span>
    </div>
  )
}