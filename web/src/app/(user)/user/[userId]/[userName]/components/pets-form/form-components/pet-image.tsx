import Image from "@/components/Image/client";
import React from "react";

export default function PetImage ({pet_image, pet_existing_image} : {pet_image?: File, pet_existing_image?: string}) {
  return (
    <div className="relative w-full flex justify-center items-center">
      <Image
        key={pet_image ? pet_image.name : "image"}
        noprocess={true}
        src={pet_image ? URL.createObjectURL(pet_image) : pet_existing_image ? pet_existing_image :  "/image.webp"}
        className="h-full w-full top-0 aspect-square right-0 object-cover rounded-full max-w-[220px] min-h-[220px]"
        width={100} height={100}
        alt={pet_image ? pet_image.name : "default image"}
      />
    </div>
  )
}