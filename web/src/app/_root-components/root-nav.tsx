import Link from "next/link";
import RootSidebar from "./root-sidebar";
import { ServerApiService } from "@/lib/server-utils";

export default async function RootNavigationButtons() {

  const isAuthenticated = await ServerApiService.get("/is-authenticated");

  return (
    <ul className="text-xs ml-auto text-primary-text font-semibold flex gap-4 whitespace-nowrap items-center">
      {
        isAuthenticated.data.data === undefined ? (
          <>
          <li><Link href="/login">ログイン</Link></li>
          <li><Link href="/signup">登録</Link></li>
          </>
        ) : (
          <h1>Hello user!</h1>
        )
      }
      <RootSidebar />
    </ul>
  )
}