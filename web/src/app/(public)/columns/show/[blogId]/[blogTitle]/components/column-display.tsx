"use client";
import z from "zod";
import {BlogSchema} from "@/types/blog-types";
import {RecipeDisplaySchema} from "@/types/recipe-types";
import Link from "next/link";
import Image from "@/components/Image/client";
import HomeSearchBar from "@/app/_root-components/home-search-bar";
import useColumnDisplay from "@/app/(public)/columns/show/[blogId]/[blogTitle]/components/use-column";

type ColumnDisplayProps = {
  blog_data: z.infer<typeof BlogSchema.Blog>;
  related_blogs: z.infer<typeof BlogSchema.BlogList>;
  popular_recipes: z.infer<typeof RecipeDisplaySchema.RecipeCardDisplayList>;
}

const blogCategories = [
  {icon: <Image src={"/icons/svg/primary-paw-print.svg"} width={16} height={16} alt={"icon for all"}/>,text: "全て", url: "/columns/list/1?category=全て"}, //pawprint
  {icon: <Image src={"/icons/svg/primary-fork-knife.svg"} width={16} height={16} alt={"icon for special feature"}/>,text: "レシピ特集", url: "/columns/list/1?category=レシピ特集"}, //fork knife
  {icon: <Image src={"/icons/svg/primary-book.svg"} width={16} height={16} alt={"icon for basic knowledge"}/>,text: "基礎知識", url: "/columns/list/1?category=基礎知識"}, // book
  {icon: <Image src={"/icons/svg/primary-paw-print.svg"} width={16} height={16} alt={"icon for others"}/>,text: "その他", url: "/columns/list/1?category=その他"}, // pawprint
]

const icons = {
  全て: <Image src={"/icons/svg/primary-paw-print.svg"} width={16} height={16} alt={"icon for all"}/>,
  レシピ特集: <Image src={"/icons/svg/primary-fork-knife.svg"} width={16} height={16} alt={"icon for special feature"}/>,
  基礎知識: <Image src={"/icons/svg/primary-book.svg"} width={16} height={16} alt={"icon for basic knowledge"}/>,
  その他: <Image src={"/icons/svg/primary-paw-print.svg"} width={16} height={16} alt={"icon for others"}/>,
}

export default function ColumnDisplay({blog_data, related_blogs, popular_recipes}: ColumnDisplayProps) {
  const { htmlString } = useColumnDisplay(blog_data);

  return (
    <article className="grid lg:gap-4 grid-cols-12">
      <section className="col-span-12 max-h-max lg:col-span-8 mt-6 bg-secondary-bg p-10">
        <h1 className="text-xl mb-2">{blog_data.title}</h1>
        <p className="flex gap-2 items-center mb-6 text-sm text-gray-500">
          {/*<CalendarPlus size={16} />*/}
          {new Date(blog_data.updated_at).toDateString()}
          <span className="ml-4">{blog_data.blog_category}</span>
        </p>
        <Image
          src={blog_data.blog_image}
          width={1280}
          fit="cover"
        />
        <div
          className="my-8 break-all"
          dangerouslySetInnerHTML={{ __html: htmlString }}
        />
      </section>
      <section className="flex flex-col gap-12 col-span-12 lg:col-span-4 lg:mt-6 bg-secondary-bg max-h-max p-4">
        <section className="hidden lg:flex flex-col gap-2">
          <header className="flex gap-4 items-center">
            <Image
              noprocess={true}
              src={"/logo.png"}
              className="relative"
              width={30}
              height={30}
              alt="website icon"
            />
            <h1>Search</h1>
          </header>
          <HomeSearchBar />
        </section>
        <section className="flex flex-col gap-2 items-center">
          <header className="flex w-full gap-4 items-center">
            <Image
              src={"/logo.png"}
              noprocess={true}
              className="relative"
              width={30}
              height={30}
              alt="website icon"
            />
            <h1>About me</h1>
          </header>
          <div className="w-full flex justify-center mb-10">
            <Image
              src={"/about_me.jpg"}
              className=" h-[130px] w-[130px] rounded-full relative"
              width={130}
              height={130}
              alt="about me image"
            />
          </div>
          <p>わんごはんの中の人。愛犬に美味しいご飯を作ってあげたい。そんな愛犬家の皆さんが作る「わんごはん」レシピを共有するサイトを作れたらと思いこのwebアプリを作成。ブログでは、飼い主さんなら知っておきたい知識をお届けしています。</p>
          <a target="_blank" href="https://www.instagram.com/rei_wangohan?igsh=MTRtcHIzaGQydTg0">
            <Image
              src={"/icons/svg/sns-ig.svg"}
              className="mt-8 h-[40px] w-[40px] relative"
              width={40}
              height={40}
              alt="website icon"
            />
          </a>
        </section>
        <section className="grid grid-cols-1">
          <header className="flex gap-4 items-center mb-4">
            <Image
              src={"/logo.png"}
              noprocess={true}
              className="relative"
              width={30}
              height={30}
              alt="website icon"
            />
            <h1>Categories</h1>
          </header>
          <nav>
            <ul className="grid grid-cols-1 gap-2">
              {blogCategories.map( (c, idx) => {
                return (
                  <li className="hover:bg-black/5 text-sm transition-colors duration-250 flex items-center gap-4 px-4 py-2" key={idx}>
                    {c.icon} <Link href={c.url}>{c.text}</Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </section>
        <section className="grid grid-cols-1">
          <header className="flex gap-4 items-center mb-4">
            <Image
              src={"/logo.png"}
              noprocess={true}
              className="relative"
              width={30}
              height={30}
              alt="website icon"
            />
            <h1>こちらの記事もチェック</h1>
          </header>
          <nav>
            <ul className="grid grid-cols-1 gap-1">
              {related_blogs.map( (c, idx) => {
                const obj = JSON.parse(JSON.stringify(c.editor_state));
                let i = 0;
                while(obj.root.children[i].type !== 'heading' && obj.root.children[i].type !== 'paragraph') {
                  i++;
                }
                const first = obj.root.children[i];
                let x = 0;
                while(first.children[x].type !== 'text') {
                  x++;
                }

                const text = first.children[x].text;

                return (
                  <li className="hover:bg-black/5 text-sm transition-colors duration-250 flex items-center gap-4 px-4 py-2" key={idx}>
                    <Link className="grid grid-cols-7 py-1 w-full gap-2 overflow-hidden" href={"/columns/" + c.blog_id}>
                      <Image
                        src={c.blog_image}
                        className=" h-[90px] w-[140px] col-span-3 relative"
                        width={120}
                        height={67.5}
                        alt={c.title}
                      />
                      <h1 className="h-[90px] relative text-sm col-span-4 overflow-hidden">
                        <span className="line-clamp-3">
                          【{c.title}】<span className="text-xs">{text}</span>
                        </span>
                        <span className="text-xs flex items-center gap-1 absolute bottom-0 right-0 text-primary-text/50">Category: {icons[c.blog_category as keyof typeof icons]}{c.blog_category}</span>
                      </h1>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </section>

        <section className="grid grid-cols-1">
          <header className="flex gap-4 items-center mb-4">
            <Image
              src={"/logo.png"}
              noprocess={true}
              className="relative"
              width={30}
              height={30}
              alt="website icon"
            />
            <h1>人気のレシピをチェック</h1>
          </header>
          <nav>
            <ul className="grid grid-cols-1 gap-1">
              {popular_recipes.map( (r, idx) => {
                return (
                  <li className="hover:bg-black/5 text-sm transition-colors duration-250 flex items-center gap-4 px-4 py-2" key={idx}>
                    <Link className="grid grid-cols-7 py-1 w-full gap-2 overflow-hidden" href={"/recipes/show/" + r.recipe_id}>
                      <Image
                        src={r.recipe_images[0].recipe_image}
                        className=" h-[90px] w-[140px] col-span-3 relative"
                        width={120}
                        height={67.5}
                        alt={r.recipe_images[0].recipe_image_title}
                      />
                      <h1 className="text-sm col-span-4 overflow-hidden">
                        <span className="line-clamp-4">
                          {r.recipe_age_tag && `【${r.recipe_age_tag}】`} {r.recipe_event_tag && `【${r.recipe_event_tag}】`} {r.recipe_size_tag && `【${r.recipe_size_tag}】`}{r.recipe_name}
                        </span>
                      </h1>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </section>
      </section>
    </article>
  )
}