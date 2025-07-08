import BannerCategoriesCarousel from "./banner-categories-carousel";
import HomeSearchBar from "./home-search-bar";

export default async function BannerCategories() {
  return (
    <section suppressHydrationWarning className="w-full lg:col-span-2 grid grid-cols-1 gap-4">
      <HomeSearchBar />
      <BannerCategoriesCarousel />
    </section>
  )
}