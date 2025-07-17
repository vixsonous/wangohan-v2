import Image from "@/components/Image/server";

export default async function User() {
  return (
    <div className="flex gap-2 justify-center w-full max-w-3xl text-primary-text mt-10">
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
        <h1>
          Second Half
        </h1>
      </section>
    </div>
  )
}