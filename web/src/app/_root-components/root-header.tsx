import Link from "next/link";
import RootNavigationButtons from "./root-nav";
import Image from "@/components/Image/server";
import HomeSearchBar from "./home-search-bar";
import GoogleLoginSuccess from "@/app/_root-components/google-login-success";

export default async function RootHeader() {
  return (
    <header className="fixed z-20 px-4 w-full pt-[5px] flex items-center gap-2 shadow-md">
      <div className='flex flex-row gap-2 w-full items-center'>
        <Link href="/">
          <Image preload className='relative' src={'/logo/logo.webp'} width={60} height={60} alt="wangohan website logo" />
        </Link>
        <HomeSearchBar />
        <RootNavigationButtons />
        <GoogleLoginSuccess />
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-secondary-bg opacity-[0.9] z-[-1]"></div>
    </header>
  )
}