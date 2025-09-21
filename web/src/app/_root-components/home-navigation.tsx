import Link from "next/link";
import GotoSearchCategoriesBtn from "./goto-search-categories-btn";
import {ROUTES} from "@/constants/routes";
import {isAuthenticated} from "@/server-actions/User/user";

export default async function HomeNavigation() {
  const userData = await isAuthenticated();
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
        href={ROUTES.COLUMNS}
        className="text-primary-text font-semibold hover:text-[#9ba3af]"
      >
        犬と食に関するコラム
      </Link>
      <span className="select-none">|</span>
      <Link
        href={userData && userData.user_details ?
          `/user/${userData.user_id}/${userData.user_details.user_codename}?register_pet=true` :
          userData && !userData.user_details ? "/signup/personal-info" : "/login"
      }
        className="text-primary-text font-semibold hover:text-[#9ba3af]"
      >
        愛犬登録
      </Link>
    </nav>
  )
}