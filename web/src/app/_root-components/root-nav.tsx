import Link from "next/link";
import RootSidebar from "./root-sidebar";
import {isAuthenticated} from "@/server-actions/User/user";
import z from "zod";
import {UserSchema} from "@/types/user-types.user";

export default async function RootNavigationButtons() {

  const userData: z.infer<typeof UserSchema.User> | undefined = await isAuthenticated();
  return (
    <ul className="text-xs ml-auto text-primary-text font-semibold flex gap-4 whitespace-nowrap items-center">
      {
        userData === undefined ? (
          <>
          <li><Link href="/login">ログイン</Link></li>
          <li><Link href="/signup">登録</Link></li>
          </>
        ) : (
          <li>
            <h1>Hello user!</h1>
          </li>
        )
      }
      <li><RootSidebar user_data={userData} /></li>
    </ul>
  )
}