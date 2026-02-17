"use client";
import Image from "@/components/Image/client";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import {Dispatch, SetStateAction, useEffect, useMemo, useState} from "react";
import z from "zod";
import {PetSchema} from "@/types/pet-types.pet";
import {UserSchema} from "@/types/user-types.user";
import {Dialog, DialogTrigger} from "@/components/ui/dialog";
import Button from "@/components/Button";
import UserPetView from "@/app/(user)/user/[userId]/[userName]/components/user-pet/user-pet-view";

export type PetProps = z.infer<typeof PetSchema.GetPet>;
function Pet({pet, idx, curSlide, setCurSlide}: {
  pet: PetProps,
  idx: number,
  curSlide: number,
  setCurSlide: Dispatch<SetStateAction<number>>
}) {

  return (
    <CarouselItem className="basis-1/3 md:basis-1/3" key={idx}>
      <Dialog>
        <DialogTrigger asChild={true}>
          <Button onClick={() => setCurSlide(idx)} type={"button"} role={"button"} aria-roledescription={`pet ${pet.pet_id} button action`} className={`${curSlide !== idx && ''}`}>
            <Image
              src={pet.pet_image}
              className={`${curSlide === idx ? 'opacity-100 pointer-events-auto scale-100' : 'opacity-50 scale-70'} transition-all duration-500 w-full h-full aspect-square object-cover`}
              style={{clipPath: curSlide === idx ? 'circle(50% at 50% 50%)': 'circle(65% at 50% 50%)'}}
              alt={pet.pet_name}
            />
          </Button>
        </DialogTrigger>
        <UserPetView pet={pet} user_id={pet.user_id} />
      </Dialog>
    </CarouselItem>
  )
}

export default function UserPetsCarousel(
  {pets, user_data, user_id, user_codename}: {
    pets: Array<z.infer<typeof PetSchema.GetPet>> | undefined,
    user_data: z.infer<typeof UserSchema.User> | undefined,
    user_id: number,
    user_codename: string,
  }
) {
  const [api, setApi] = useState<CarouselApi>();
  let initialSlideIndex = useMemo(() => {
    if(pets === undefined) return 0;
    if(pets.length < 2) return pets.length - 1;
    if(pets.length === 3) return 1;
    if(pets.length > 3) return 0;
    return 0;
  }, [pets?.length || 0])
  const [curSlide, setCurSlide] = useState(initialSlideIndex);

  useEffect(() => {
    if(!api) return;
    api.on("select", () => {
      setCurSlide(api.selectedScrollSnap());
    });
  }, [api]);

  if(pets === undefined || pets.length === 0) {
    return (
      <h1>{user_id === user_data?.user_id ? `You don't` : `${user_codename} doesn't`} have any pets!</h1>
    )
  }

  return (
    <Carousel opts={{loop: true, watchDrag: pets.length > 3, align: 'center'}} plugins={[
          Autoplay({
            delay: 5000,
          })
        ]} setApi={setApi} className="max-w-md md:max-w-lg pb-8">
      <CarouselContent className={`${pets.length > 1 ? '' : 'flex justify-center'}`}>
        {pets.map((a, idx) => {
          return (
            <Pet setCurSlide={setCurSlide} key={idx} pet={a} idx={idx} curSlide={curSlide} />
          )
        })}
      </CarouselContent>
    </Carousel>
  )
}