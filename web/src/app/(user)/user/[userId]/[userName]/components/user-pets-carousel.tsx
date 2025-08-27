"use client";
import Image from "@/components/Image/client";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";
import z from "zod";
import {PetSchema} from "@/types/pet-types.pet";
import {UserSchema} from "@/types/user-types.user";
import {format} from "date-fns";
import {Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import Button from "@/components/Button";

function Pet({pet, idx, curSlide}: {
  pet: z.infer<typeof PetSchema.GetPet>,
  idx: number,
  curSlide: number,
}) {

  return (
    <CarouselItem className="basis-2/3" key={idx}>
      <Dialog>
        <DialogTrigger asChild={true}>
          <Button>
            <Image src={pet.pet_image} className={`${curSlide === idx ? 'opacity-100 pointer-events-auto' : 'opacity-50 pointer-events-none'} transition-all border-4 border-primary-text duration-500 w-full h-full aspect-square object-cover`} style={{clipPath: curSlide === idx ? 'circle(70% at 50% 50%)': 'circle(50% at 50% 50%)'}} alt={pet.pet_name} />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <div className={"relative"}>
            <DialogTitle className={"text-center z-10 relative -top-[200%]"}>
              {pet.pet_name}
            </DialogTitle>
            <Image width={300} height={122} src={"/banner/ribbon.webp"} className={"absolute bg-primary-bg rounded-lg pt-4 -top-[400%] left-1/2 -translate-x-1/2"} alt="ribbon banner image"/>
          </div>

          <DialogDescription className={"text-center"}>This is your pet</DialogDescription>
          <section className={"flex flex-col md:flex-row gap-4 relative"}>
            <div className={'w-full flex justify-center items-center md:w-auto md:block'}>
              <Image height={100} width={100} src={pet.pet_image} className={`border-4 max-h-48 max-w-48 border-primary-text duration-500 w-full h-full aspect-square object-cover`} alt={pet.pet_name} />
            </div>
            <div className={"w-full flex flex-col items-center md:w-auto md:block"}>
              <p><span className={"font-bold"}>愛犬の名前:</span> {pet.pet_name}</p>
              <p><span className={"font-bold"}>誕生日:</span> {format(new Date(pet.pet_birthdate).toDateString(), "MMMM do yyyy")}</p>
              <p><span className={"font-bold"}>姓:</span> {pet.pet_breed}</p>
            </div>
          </section>
        </DialogContent>
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
  const [curSlide, setCurSlide] = useState(0);

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
    <Carousel opts={{loop: true}} plugins={[
          Autoplay({
            delay: 5000
          })
        ]} setApi={setApi} className="max-w-xs">
      <CarouselContent>
        {pets.map((a, idx) => {
          return (
            <Pet key={idx} pet={a} idx={idx} curSlide={curSlide} />
          )
        })}
      </CarouselContent>
    </Carousel>
  )
}