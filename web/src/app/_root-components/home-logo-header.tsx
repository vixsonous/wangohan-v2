import Image from "@/components/Image/server";
import { NextFont } from "next/dist/compiled/@next/font";

export default function HomeLogoHeader({mochi, gloria}: {mochi: NextFont, gloria: NextFont}) {
  return (
    <header className="mt-8 lg:mt-0 flex flex-col items-center text-secondary-text">
      <Image className="relative left-3.5" src={"/logo/logo-wangohan-front.png"} width={130} alt="wangohan home page logo"/>
      <h1
        className={`text-4xl font-bold leading-tight ${mochi.className}`}
      >
        わんごはん
      </h1>
      <span className={`text-xxs ${gloria.className}`}>
        ALL RECIPES FOR YOUR DOG
      </span>
    </header>
  )
}