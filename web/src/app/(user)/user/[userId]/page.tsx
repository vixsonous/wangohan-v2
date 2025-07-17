import Image from "@/components/Image/server";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function User() {
  return (
    <div className="flex gap-2 justify-center w-full max-w-7xl text-primary-text mt-10">
      <section className="w-full flex flex-col gap-2 items-center">
        <Image className="rounded-full" width={300} height={300} src={"/image.webp"} alt="profile picture"/>
        <h1>Codename</h1>
        <div className="relative">
          <Image width={300} height={122} src={"/banner/ribbon.webp"}/>
          <h1 className="absolute top-1/12 pt-1 font-semibold text-sm md:text-lg left-1/2 -translate-x-1/2">
            うちのわん
          </h1>
        </div>
      </section>
      <section className="w-full">
        <Tabs defaultValue="my-recipes">
          <TabsList>
            <TabsTrigger value="my-recipes">自分のレシピ</TabsTrigger>
            <TabsTrigger value="liked-recipes">
              <Image noprocess src={"/icons/svg/primary-heart.svg"} alt="heart icon for liked recipes"/>
              したレシピ
            </TabsTrigger>
          </TabsList>
          <TabsContent value="my-recipes">
            <Card className="bg-secondary-bg">
              <CardHeader><h1>My Recipes</h1></CardHeader>
              <CardContent>
                <span>My recipes here</span>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="liked-recipes">
            <Card className="bg-secondary-bg">
              <CardHeader><h1>Liked recipes</h1></CardHeader>
              <CardContent>
                <span>My liked recipes here</span>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}