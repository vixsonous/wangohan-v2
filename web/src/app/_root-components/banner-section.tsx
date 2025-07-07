import BannerCarousel from "./banner-carousel";

export default function BannerSection() {
  return (
    <section className="lg:my-4 grid grid-cols-1 lg:grid-cols-5 items-start gap-4">
      <BannerCarousel />
      <div className="w-full lg:col-span-2">This is the categories</div>
    </section>
  )
}