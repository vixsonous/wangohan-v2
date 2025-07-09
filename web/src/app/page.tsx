import { Gloria_Hallelujah, Mochiy_Pop_P_One } from "next/font/google";
import HomeNavigation from "./_root-components/home-navigation";
import HomeLogoHeader from "./_root-components/home-logo-header";
import BannerSection from "./_root-components/banner-section";
import ThisWeekRecipeCarousel from "./_root-components/this-week-recipe-carousel";
import RecipeCarouselWrapper, { RecipeProps } from "./_root-components/recipe-carousel-wrapper";
import BirthdayWrapper from "./_root-components/birthday-wrapper";
import ColumnBanner from "./_root-components/column-banner";

const gloria = Gloria_Hallelujah({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});

const mochi = Mochiy_Pop_P_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});

const recipes = Array(10).fill(
  {recipe_id: 1, recipe_image: "/image.webp", recipe_age_tag: "", recipe_description: "description", recipe_event_tag: "adsas", recipe_name: "犬用ケーキ生地の作り方", recipe_rating_data: {
    avgRating: 4,
    totalRating: 200
  }, recipe_size_tag: "", created_at: new Date(), total_likes: 5, total_views: 10, user_id: 5} satisfies RecipeProps
)

export default function Home() {
  return (
    <section className={`w-full flex flex-col items-center px-6 py-6 lg:px-0 min-h-screen`}>
      <HomeLogoHeader mochi={mochi} gloria={gloria}/>
      <HomeNavigation />
      <BannerSection />
      <RecipeCarouselWrapper title="今週のレシピ" recipes={recipes}/>
      <RecipeCarouselWrapper title="人気レシピ" recipes={recipes}/>
      <BirthdayWrapper />
      <ColumnBanner />
    </section>
  );
}
