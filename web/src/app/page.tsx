import { Gloria_Hallelujah, Mochiy_Pop_P_One } from "next/font/google";
import HomeNavigation from "./_root-components/home-navigation";
import HomeLogoHeader from "./_root-components/home-logo-header";
import BannerSection from "./_root-components/banner-section";
import RecipeCarouselWrapper from "./_root-components/recipe-carousel-wrapper";
import BirthdayWrapper from "./_root-components/birthday-wrapper";
import ColumnBanner from "./_root-components/column-banner";
import { getSliderRecipes } from "@/server-actions/recipe";

export const gloria = Gloria_Hallelujah({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});

export const mochi = Mochiy_Pop_P_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});



export default async function Home() {

  const sliderData = await getSliderRecipes();

  if(sliderData === undefined) {
    return <section className={`w-full flex flex-col items-center px-6 py-6 lg:px-0 min-h-screen`}>
      <h1>There was an error</h1>
    </section>
  }

  return (
    <section className={`w-full flex gap-2.5 flex-col items-center px-6 py-6 lg:px-0 min-h-screen`}>
      <HomeLogoHeader mochi={mochi} gloria={gloria}/>
      <HomeNavigation />
      <BannerSection />
      <RecipeCarouselWrapper title="今週のレシピ" recipes={sliderData.weeklyRecipes}/>
      <RecipeCarouselWrapper title="人気レシピ" recipes={sliderData.popularRecipes}/>
      <BirthdayWrapper />
      <ColumnBanner />
    </section>
  );
}
