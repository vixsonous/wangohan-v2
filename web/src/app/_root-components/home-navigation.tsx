import Link from "next/link";
import GotoSearchCategoriesBtn from "./goto-search-categories-btn";

export default function HomeNavigation() {
  return (
    <nav className="flex text-sm md:text-base gap-2 sm:gap-4 mt-10 flex-wrap justify-center w-full md:justify-between md:px-8">
      <GotoSearchCategoriesBtn />
      <span className="select-none">|</span>
      <Link
        // href={isLoggedIn ? "" : "/login"}
        href={"/login"}
        className="text-primary-text font-semibold hover:text-[#9ba3af]"
      >
        レシピを作成する
      </Link>
      <span className="select-none">|</span>
      <Link
        href={"/recipe/list/1"}
        className="text-primary-text font-semibold hover:text-[#9ba3af]"
      >
        レシピ図鑑
      </Link>
      <span className="select-none opacity-0 md:opacity-100">|</span>
      <Link
        href={"/columns/list/1"}
        className="text-primary-text font-semibold hover:text-[#9ba3af]"
      >
        犬と食に関するコラム
      </Link>
      <span className="select-none">|</span>
      <Link
        href={`/user/settings/${-1}?=#register-pet`
        }
        className="text-primary-text font-semibold hover:text-[#9ba3af]"
      >
        愛犬登録
      </Link>
    </nav>
  )
}