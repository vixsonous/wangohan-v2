import Image from "@/components/Image/server";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

export default async function BannerCarousel() {

  const items = [
    "/logo/logo-wangohan-front.png",
    "/logo/logo-wangohan-front.png",
    "/logo/logo-wangohan-front.png",
  ]
  return (
    <Carousel opts={{loop: true}} className="w-full h-[400px] col-span-3">
      <CarouselContent hfull>
        {
          items.map((i, x) => {
            return (
              <CarouselItem key={x}>
                <Image className="h-full w-full" src={i} alt={i} width={768} height={400}/>
              </CarouselItem>
            )
          })
        }
      </CarouselContent>
    </Carousel>
  )
}