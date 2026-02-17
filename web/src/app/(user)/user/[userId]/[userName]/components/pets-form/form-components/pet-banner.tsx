import Image from "@/components/Image/client";
import React from "react";

export default function PetBanner () {
  return (
    <Image
      src={'/banner/3dogs.webp'}
      className="-top-8 md:-top-4 z-10 absolute h-[auto] rounded-[25px]"
      width={100}
      alt="website banner"
    />
  );
}
