"use client";
import Button from "@/components/Button";
import Image from "@/components/Image/client";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

const dogCategory = [
  {
    title: "年齢別で探す",
    items: [
      {text: "子犬用レシピ", href: "/recipe/search/子犬", img: "/icons/categories/puppy-thumbnail.png", alt: "wangohan puppy category thumbnail"},
      {text: "成犬用レシピ", href: "/recipe/search/成犬", img: "/icons/categories/adult-thumbnail.png", alt: "wangohan adult dog category thumbnail"},
      {text: "シニア犬用レシピ", href: "/recipe/search/シニア犬", img: "/icons/categories/senior-thumbnail.png", alt: "wangohan senior dog category thumbnail"},
    ]
  },
  {
    title: "サイズ別で探す",
    items: [
      {text: "小型犬用レシピ", href: "/recipe/search/小型犬", img: "/icons/categories/smalldog-thumbnail.png", alt: "wangohan small size dogs category thumbnail"},
      {text: "中型犬用レシピ", href: "/recipe/search/中型犬", img: "/icons/categories/averagedog-thumbnail.png", alt: "wangohan average size dogs category thumbnail"},
      {text: "大型犬用レシピ", href: "/recipe/search/大型犬", img: "/icons/categories/bigdog-thumbnail.png", alt: "wangohan big size dogs category thumbnail"},
    ]
  }
]

const events = [
  {
    title: "イベント別で探す",
    items: [
      {
        text: "お誕生日",
        img: "/icons/categories/events/birthday.webp",
        href: "/recipe/search/お誕生日",
        alt: "birthday category icon for search"
      },
      {
        text: "おうち記念日",
        img: "/icons/categories/events/ouchianniversary.webp",
        href: "/recipe/search/おうち記念日",
        alt: "birthday category icon for search"
      },
      {
        text: "お正月",
        img: "/icons/categories/events/newyears.webp",
        href: "/recipe/search/お正月",
        alt: "birthday category icon for search"
      },
      { text: "節分", 
        img: "/icons/categories/events/setsubun.webp", 
        href: "/recipe/search/節分",
        alt: "birthday category icon for search"
      },
      {
        text: "ひな祭り",
        img: "/icons/categories/events/hinamatsuri.webp",
        href: "/recipe/search/ひな祭り",
        alt: "birthday category icon for search"
      },
      {
        text: "こどもの日",
        img: "/icons/categories/events/kodomonohi.webp",
        href: "/recipe/search/こどもの日",
        alt: "birthday category icon for search"
      },
    ]
  },
  {
    title: "イベント別で探す",
    items: [
      {
        text: "七夕",
        img: "/icons/categories/events/tanabata.webp",
        href: "/recipe/search/七夕",
        alt: "birthday category icon for search"
      },
      {
        text: "ハロウィン",
        img: "/icons/categories/events/halloween.webp",
        href: "/recipe/search/ハロウィン",
        alt: "birthday category icon for search"
      },
      {
        text: "クリスマス",
        img: "/icons/categories/events/christmas.webp",
        href: "/recipe/search/クリスマス",
        alt: "birthday category icon for search"
      },
      { text: "おやつ", 
        img: "/icons/categories/events/snack.webp", 
        href: "/recipe/search/おやつ",
        alt: "birthday category icon for search"
      },
      {
        text: "ダイエット",
        img: "/icons/categories/events/diet.webp",
        href: "/recipe/search/ダイエット",
        alt: "birthday category icon for search"
      },
    ]
  }
];

export default function BannerCategoriesCarousel() {

  const [api, setApi] = useState<CarouselApi>();
  const [cur, setCur] = useState(0);
  const [cnt, setCnt] = useState(0);

  const apiScrollTo = useCallback((idx: number) => {
    return (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if(!api) return;
      api.scrollTo(idx);
    }
  }, [api]);

  useEffect(() => {
    if(!api) return

    setCnt(api.scrollSnapList().length);
    setCur(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCur(api.selectedScrollSnap() + 1);
    })
  }, [api]);

  return (
    <Carousel setApi={setApi} className="w-full">
      <CarouselContent hfull>
        <CarouselItem className="grid grid-cols-1 gap-4">
          {dogCategory.map( d => {
            return (
              <section key={d.title} className="first-row w-full flex gap-4 justify-center flex-col items-center">
                <h1 className="text-xl text-primary-text font-semibold">
                  {d.title}
                </h1>
                <nav className="grid grid-cols-3 w-full">
                  {d.items.map((category) => {
                    return (
                      <Link
                        key={category.text}
                        href={category.href}
                        className="flex gap-2 text-primary-text font-bold flex-col justify-center items-center"
                      >
                        <Image
                          src={category.img}
                          width={167}
                          className="relative rounded-md"
                          alt={category.alt}
                        />
                        <p className="relative text-xs">{category.text}</p>
                      </Link>
                    )
                  })}
                </nav>
              </section>
            )
          })}
        </CarouselItem>
        {
          events.map( (e, idx) => {
            return (
              <CarouselItem key={idx} className="grid grid-cols-1 gap-4">
                <section key={e.title} className="first-row w-full flex gap-4 flex-col items-center">
                  <h1 className="text-xl text-primary-text font-semibold">
                    {e.title}
                  </h1>
                  <nav className="grid grid-cols-3 w-full gap-y-12">
                    {e.items.map((category) => {
                      return (
                        <Link
                          key={category.text}
                          href={category.href}
                          className="flex gap-2 text-primary-text font-bold flex-col justify-center items-center"
                        >
                          <Image
                            src={category.img}
                            width={167}
                            className="relative rounded-md"
                            alt={category.alt}
                          />
                          <p className="relative text-xs">{category.text}</p>
                        </Link>
                      )
                    })}
                  </nav>
                </section>
              </CarouselItem>
            )
          })
        }
      </CarouselContent>
      <section className="flex justify-center w-full gap-2 mt-2">
        {Array(cnt).fill(0).map( (c, idx) => {
          return (
            <Button role={"button"} key={idx} aria-label={"carousel-categories-button-" + idx} name={"carousel-categories-button-" + idx} aria-labelledby={"carousel-categories-button-" + idx} onClick={apiScrollTo(idx)} className={`w-2 h-2 rounded-full ${(cur - 1) === idx ? 'bg-bullet' : 'bg-inactive'}`}></Button>
          )
        })}
      </section>
    </Carousel>
  )
}