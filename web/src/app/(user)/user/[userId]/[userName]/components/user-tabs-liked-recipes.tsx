import Image from "@/components/Image/server"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Link from "next/link"

export default async function LikedRecipes() {
  return (
    <Card className="bg-secondary-bg pb-0 rounded-b-none">
      <CardHeader><h1>My Recipes</h1></CardHeader>
      <CardContent className="grid p-1 grid-cols-3 gap-1 grid-rows-3">
        {Array.from(Array(9).keys()).map( a => {
          return (
            <Link href={"/recipe/show/" + a} key={a} className="w-full h-full group relative">
              <Image src={"/image.webp"} className="w-full rounded-md group-hover:brightness-50 transition-all duration-200 h-full object-cover aspect-square bg-gray-300" />
              <h1 className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 text-white font-bold text-lg">Title here</h1>
            </Link>
          )
        })}
      </CardContent>
    </Card>
  )
}