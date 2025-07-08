import BannerCarousel from "./banner-carousel";
import BannerCategories from "./banner-categories";

export default function BannerSection() {
  return (
    <section className="lg:my-4 grid grid-cols-1 lg:grid-cols-5 items-start gap-4">
      <BannerCarousel />
      <BannerCategories />
    </section>
  )
}