"use client";
import Button from "@/components/Button";
import React from "react";
import Image from "@/components/Image/client";

export default function FontColor() {
  return (
    <div className={"flex items-center gap-2"}>
      <label
        htmlFor="text-color"
        className="flex gap-1 items-center cursor-pointer"
      >
        <Image src={"/icons/svg/primary-aa.svg"} alt={"text color icon"} width={20} height={20}/>
        <input
          // onChange={tbHelper.fontColorOnChange}
          type="color"
          id="text-color"
          // value={states.fontColor}
          className="bg-none p-0 cursor-pointer w-6"
        />
      </label>
      <div>
        Previous colors
      </div>
    </div>
  )
}