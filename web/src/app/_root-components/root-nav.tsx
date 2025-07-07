import Link from "next/link";
import RootSidebar from "./root-sidebar";

export default async function RootNavigationButtons() {
  return (
    <ul className="text-xs ml-auto text-primary-text font-semibold flex gap-4 whitespace-nowrap items-center">
      <li><Link href="/login">ログイン</Link></li>
      <li><Link href="/signup">登録</Link></li>
      <RootSidebar />
    </ul>
  )
}