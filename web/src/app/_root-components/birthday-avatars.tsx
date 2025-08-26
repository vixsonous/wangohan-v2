"use client";

import Image from "@/components/Image/client";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";
import z from "zod";
import {PetSchema} from "@/types/pet-types.pet";

interface  AvatarProps {
  active: boolean;
  pet_image: string;
  pet_name: string;
}



function Avatar({active, pet_image, pet_name}: AvatarProps) {

  const [scale, setScale] = useState<number>(1.5);
  const [isSet, setIsSet] = useState(false);

  useEffect(() => {
    
    if(active) {
      setScale(window.innerWidth < 1024 ? 1.3 : 2);
    } else {
      setScale(window.innerWidth < 1024 ? 1 : 1.5);
    }

    setIsSet(true);
  }, [active]);
  
  if(isSet) {
    return (
      <div className="relative flex-[0_0_100%] text-white flex flex-col items-center justify-center">
        <div style={{ scale: scale}} className={`transition-all duration-1000 w-full flex justify-center ${active ? 'animate-bubble': ''}`}>
          <Image width={100} height={100} src={pet_image} loading="lazy" className="aspect-square max-w-[100px] max-h-[100px] rounded-full object-cover overflow-hidden" alt="website banner" />
        </div>
        <h1 className="whitespace-nowrap relative w-full text-sm opacity-90 z-10 bg-primary-bg font-bold text-[#523636] text-center">
          {pet_name}
          <div className='absolute w-full h-full top-0 left-0 bg-primary-bg opacity-10'></div>
        </h1>
      </div>
    )
  }
}

export default function BirthdayAvatars({birthday_pets}: {birthday_pets: Array<z.infer<typeof PetSchema.GetPet>>}) {

  const [api, setApi] = useState<CarouselApi>();
  const [selectedIdx, setSelectedIdx] = useState<number>();

  useEffect(() => {
    if(!api) return;
    setSelectedIdx(api.selectedScrollSnap());
    const onSelect = () => {
      setSelectedIdx(api.selectedScrollSnap());
    };
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    }
  }, [api]);

  if(birthday_pets.length === 0) {
    return (
      <h1 className={"w-full text-center"}>No birthdays this month!</h1>
    )
  }

  return (
    <Carousel setApi={setApi} opts={{
      align: 'center',
      loop: true
    }} plugins={[
      Autoplay({
        delay: 5000
      })
    ]}>
      <CarouselContent className="items-center h-[200px] lg:h-[250px]">
        {
          birthday_pets.map( (k, idx) => {
            return <CarouselItem className="lg:basis-1/5 md:basis-1/3" key={k.pet_id}>
              <Avatar pet_image={k.pet_image} pet_name={k.pet_name} active={selectedIdx === idx} />
            </CarouselItem>
          })
        }
      </CarouselContent>
    </Carousel>
  )
}