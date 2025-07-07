import { Gloria_Hallelujah, Mochiy_Pop_P_One } from "next/font/google";
import HomeNavigation from "./_root-components/home-navigation";
import HomeLogoHeader from "./_root-components/home-logo-header";
import BannerSection from "./_root-components/banner-section";

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

export default function Home() {
  return (
    <section className="w-full flex flex-col items-center px-6 py-6 lg:px-0 min-h-screen">
      <HomeLogoHeader mochi={mochi} gloria={gloria}/>
      <HomeNavigation />
      <BannerSection />
    </section>
  );
}
