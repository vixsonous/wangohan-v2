"use client";

import { Gloria_Hallelujah, Inter, Mochiy_Pop_P_One } from "next/font/google";

export const mochi = Mochiy_Pop_P_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});

export const gloria = Gloria_Hallelujah({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});

export const inter = Inter({ subsets: ["latin"], display: 'swap', adjustFontFallback: false });