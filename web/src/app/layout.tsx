import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RootHeader from "./_root-components/root-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getRecipe } from "@/server-actions/recipe";
import { ServerUtils } from "@/lib/server-utils";
import RootFooter from "./_root-components/root-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata:Metadata = {
  title: {
    template: '%s | わんごはん | 愛犬のための手作りごはんレシピサイト',
    default: "わんごはん | 愛犬のための手作りごはんレシピサイト"
  },
  keywords: ["愛犬のための手作りごはんレシピサイト",
    "わんごはん",
    "犬用手作りごはん",
    "wangohan",
    "homemade dog food",
    "healthy pet food",
    "dog recipe ideas",
    "ペットレシピサイト"],
  creator: "Victor Chiong",
  description: "わんちゃん専用投稿型レシピサイト。レシピ投稿や検索はもちろん、愛犬登録や誕生日月アナウンスなど盛りだくさん！皆さんの『わんごはん』レシピを投稿してみませんか？",
  openGraph: {
    title: 'わんごはん - 愛犬のための手作りごはんレシピサイト',
    description: 'わんちゃん専用投稿型レシピサイト。レシピ投稿や検索はもちろん、愛犬登録や誕生日月アナウンスなど盛りだくさん！皆さんの『わんごはん』レシピを投稿してみませんか？',
    url: 'https://wangohanjp.com', // Your website URL
    type: 'website',
    images: [
        { url: 'https://wangohanjp.com/logo-final.webp', width: 500, height: 500, alt: 'わんごはん' }
    ]
  },
  robots: {
    index:true,
    follow: true,
    nocache: false,
  },
  
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await getRecipe();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    "name": "わんごはん",
    "description": "わんちゃん専用投稿型レシピサイト。レシピ投稿や検索はもちろん、愛犬登録や誕生日月アナウンスなど盛りだくさん！皆さんの『わんごはん』レシピを投稿してみませんか？",
    "image": "https://wangohanjp.com/logo-final.webp",
    "author": {
      "@type": "Person",
      "name": "Victor Chiong"
    },
    "keywords": "犬用レシピ, 手作りごはん",
  };

  const preloads = ServerUtils.getPreloads();
  return (
    <html lang="en">
      <head>
        {preloads.map( l => {
          return (
            <link key={l} rel="preload" href={l} as="image"/>
          )
        })}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="google-adsense-account" content="ca-pub-9990388374961956"></meta>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9990388374961956"
          crossOrigin="anonymous"></script>
      </head>
      <body
        style={{fontFamily: 'mitimasu'}}
        className={` antialiased bg-primary-bg `}
      >
        <SidebarProvider className="grid grid-cols-1">
          <RootHeader />
          <main className={`pt-[65.68px] min-h-screen flex grow justify-center`}>
            <div className='w-screen max-w-7xl'>{children}</div>
          </main>
          <RootFooter />
        </SidebarProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
