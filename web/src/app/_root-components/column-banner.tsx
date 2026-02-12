import Image from "@/components/Image/server";
import Link from "next/link";
import {ROUTES} from "@/constants/routes";

export default async function ColumnBanner() {
  return (
    <Link href={ROUTES.COLUMNS} className="flex flex-col relative mt-16">
      <h1 className="flex justify-center w-full top-4 items-center absolute text-2xl lg:text-4xl font-bold text-primary-text">
        役立つコラムはこちら
      </h1>
      <nav className="absolute flex justify-center w-full top-14 lg:top-24">
        <span className=" bg-primary-text rounded-md text-xs text-white py-2 px-4">
          コラム
        </span>
      </nav>
      <Image
        src={"/banner/column.png"}
        loading="lazy"
        className="rounded-md w-full h-full inline max-w-none object-fill"
        alt="website banner"
      />
    </Link>
  )
}