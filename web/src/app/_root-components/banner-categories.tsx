import BannerCategoriesCarousel from "./banner-categories-carousel";
import HomeSearchBar from "./home-search-bar";

export default async function BannerCategories() {
  return (
    <section suppressHydrationWarning className="w-full col-span-3 lg:col-span-2 grid grid-cols-1 gap-4">
      <HomeSearchBar id={"category-search"} />
      <BannerCategoriesCarousel />
    </section>
  )
}