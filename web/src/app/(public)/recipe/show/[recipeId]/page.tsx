import { Card, CardContent } from "@/components/ui/card";
import ShowRecipeCarousel from "./show-recipe-carousel";
import ShowRecipeTags from "./show-recipe-tags";
import ShowRecipeIngredients from "./show-recipe-ingredients";
import ShowRecipeInstructions from "./show-recipe-instructions";
import Link from "next/link";
import Image from "@/components/Image/server";
import ShowRecipeCommentsHeader from "./show-recipe-comments-header";
import ShowRecipeComments from "./show-recipe-comments";
import { Metadata } from "next";

export const metadata:Metadata = {
  title: "クリスマス3色あんかけ",
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

export default async function ShowRecipe() {
  const recipe_data = {
    recipe_id: 6,
    user: {
      user_id: 6,
    },
    recipe_name: "クリスマス3色あんかけ",
    recipe_description: `簡単に作れるクリスマスメニュー🎄
    ドッグフードにかけてあんかけ風に♪
    野菜はお好みのもの使用してください。
    　
    <クリスマス感をアップさせるには？>
    ▫️各野菜を星型にくり抜く
    ▫️クリスマスのフラッグ楊枝で飾りつける`,
    recipe_ingredients: [
      {recipe_ingredients_name: "qweqwe", recipe_ingredients_amount: "1 qwe"},
      {recipe_ingredients_name: "qweqwe", recipe_ingredients_amount: "1 qwe"},
      {recipe_ingredients_name: "qweqwe", recipe_ingredients_amount: "1 qwe"},
      {recipe_ingredients_name: "qweqwe", recipe_ingredients_amount: "1 qwe"},
      {recipe_ingredients_name: "qweqwe", recipe_ingredients_amount: "1 qwe"},
      {recipe_ingredients_name: "qweqwe", recipe_ingredients_amount: "1 qwe"},
    ],
    recipe_instructions: [
      "各野菜を星型にくり抜き、硬い野菜は火を通しておく。",
      "鶏むねひき肉を水で煮る。",
      "②に①とかつおぶしを加え、さらに煮る。",
      "火を止め、水溶き片栗粉を加えてとろみをつける。",
      "ドッグフードの上にかけて完成♪",
    ],
    recipe_age_tag: "a,aqwe,qwtqwt,asdasd",
    recipe_size_tag: "asd,rrwet,dfgdfg,qweqwe",
    recipe_event_tag: "qweqwe,asdasd,sdgsdg",
    comments: [
      {
        recipe_comment_id: 3,
        recipe_comment_rating: 5,
        recipe_comment_subtext: "tasdasdasd",
        recipe_comment_title: "adasfsg",
        recipe_id: 5,
        user_id: 1,
        user: {
          user_id: 33,
          user_image: "/image.webp",
          user_codename: "wangohan",
        },
        created_at: new Date().toDateString()
      },
      {
        recipe_comment_id: 3,
        recipe_comment_rating: 5,
        recipe_comment_subtext: "tasdasdasd",
        recipe_comment_title: "adasfsg",
        recipe_id: 5,
        user_id: 1,
        user: {
          user_id: 33,
          user_image: "/image.webp",
          user_codename: "wangohan",
        },
        created_at: new Date().toDateString()
      }
    ]
  }
  return (
    <section className="flex max-w-3xl flex-col text-primary-text items-center w-full mt-10 gap-2">
      <ShowRecipeCarousel />
      <ShowRecipeTags {...recipe_data}/>
      <section className="flex w-full flex-col p-5 gap-7">
        <header className="flex flex-col gap-7">
          <h1 className="text-2xl font-semibold max-w-max">{recipe_data.recipe_name}</h1>
          <p className="leading-snug text-xs whitespace-pre-line">
            {recipe_data.recipe_description}
          </p>
        </header>
        <ShowRecipeIngredients recipe_ingredients={recipe_data.recipe_ingredients}/>
        <ShowRecipeInstructions recipe_instructions={recipe_data.recipe_instructions}/>
        <ShowRecipeCommentsHeader avgRating={4.5} totalRating={10} recipe_id={recipe_data.recipe_id} user_id={recipe_data.user.user_id} user_picture="/image.webp"/>
        <ShowRecipeComments comments={recipe_data.comments} total_comments={10}/>
      </section>
    </section>
  )
}