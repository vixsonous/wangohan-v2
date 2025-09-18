"use client";
import Button from "@/components/Button";
import Image from "@/components/Image/client";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import z from "zod";
import {UserSchema} from "@/types/user-types.user";
import {useMutation} from "@tanstack/react-query";
import {ClientApiResponseService, ClientApiService} from "@/lib/client-utils";
import {AxiosError, AxiosResponse} from "axios";
import {toast} from "sonner";
import {SheetClose} from "@/components/ui/sheet";
import {ENDPOINTS} from "@/constants/endpoints";

export default function SidebarMenu(
  {user_data}:
  {user_data: z.infer<typeof UserSchema.User> | undefined}
) {
  const pathname = usePathname();
  const router = useRouter();


  const logoutMutation = useMutation({
    mutationFn: () => ClientApiService.post(ENDPOINTS.AUTH + "/logout", undefined),
    onSuccess: (data: AxiosResponse) => {
      const message = ClientApiResponseService.getAxiosResponseMessage(data);
      toast.success("Successful!",  {description: message});
      router.refresh();

    },
    onError: (error: AxiosError) => {
      const message = ClientApiResponseService.getAxiosErrorMessage(error);
      toast.error("Error!", {description: message});
    }
  });

  const links = [
    {text: "トップページ", show: true, condition: pathname === "/", href: "/", src: "/icons/svg/white-house.svg", alt: "an icon for home button", type: "link"},
    {text: "マイページ", show: user_data !== undefined, condition: pathname.includes("/user/") || pathname.includes("/signup/personal-info"), href: user_data?.user_details !== null ? `/user/${user_data?.user_id}/${user_data?.user_details?.user_codename}`: `/signup/personal-info`, src: "/icons/svg/primary-user.svg", alt: "an icon for user", type: "link"},
    {text: "レシピを探す", show: true, condition: false, href: "/", src: "/icons/svg/white-magnifying-glass.svg", alt: "an icon for search recipe", type: "button"},
    {text: "レシピ図鑑", show: true, condition: pathname.includes("/recipe/list"), href: "/recipe/list/1", src: "/icons/svg/white-book.svg", alt: "an icon for recipe list", type: "link"},
    {text: "犬と食に関するコラム", show: true, condition: pathname.includes("/columns") , href: "/columns", src: "/icons/svg/white-paw-print.svg", alt: "an icon for columns/blog", type: "link"},
    {text: "愛犬登録", show: true, condition: pathname.includes("/user/settings/"), href: user_data === undefined ? "/login" : `/user/${user_data?.user_id}/${user_data?.user_details?.user_codename}?register_pet=true`, src: "/icons/svg/white-paw-print.svg", alt: "an icon for pet registration", type: "link"},
    {text: "ログアウト", function: () => logoutMutation.mutate(), show: user_data !== undefined, condition: false, href: `/`, src: "/icons/svg/primary-sign-out.svg", alt: "sign out icon", type: "button"},
  ]

  return (
    <nav className="font-bold flex flex-col bg-secondary-bg w-full p-2 gap-2 rounded-2xl border border-primary-text">
      {
        links.map( (l, idx) => {

          if(!l.show) {
            return undefined;
          }
          
          if(l.type === "link") {
            return (
              <SheetClose key={idx} asChild={true}>
                <Link

                  className={`${l.condition ? 'bg-primary-text text-secondary-bg py-2' : 'hover:opacity-75 py-1'} 
                px-4 rounded-full w-full text-sm flex justify-between items-center`}
                  href={l.href}
                >
                  <Image noprocess src={l.condition ? l.src : l.src.replace("white","primary")} alt={l.alt}/>
                  {l.text}
                </Link>
              </SheetClose>
            )
          } else {
            return (
              <SheetClose key={idx} asChild={true}>
                <Button
                  onClick={l.function ? l.function: undefined}
                  key={idx}
                  className={`${l.condition ? 'bg-primary-text text-secondary-bg py-2' : 'hover:opacity-75 py-1'} 
                px-4 rounded-full w-full text-sm flex justify-between items-center`}
                >
                  <Image noprocess src={l.condition ? l.src : l.src.replace("white","primary")} alt={l.alt}/>
                  {l.text}
                </Button>
              </SheetClose>
            )
          }
        })
      }

      {/* {
        user.user_id !== 0 && (
          <Link onClick={openSettings} className={`${active.user ? 'bg-primary-text text-secondary-bg py-2' : 'hover:opacity-75 py-1'} w-full px-4 py-1 rounded-full`} href={`/user/${user.user_id}`}>
            <div className="w-full text-sm flex justify-between items-center">
                <User size={20}/>
                マイページ
            </div>
          </Link>
        )
      } */}

      {/* <Button className={`hover:opacity-75 w-full px-4 py-1 rounded-full text-sm flex justify-between items-center`}>
        <Image src={"/icons/svg/magnifying-glass.svg"} alt="an icon for search recipe"/>
        レシピを探す
      </Button>

      <Link 
        className={`${pathname.includes("/recipe/list") ? 'bg-primary-text text-secondary-bg py-2' : 'hover:opacity-75 py-1'} 
          w-full px-4 py-1 rounded-full text-sm flex justify-between items-center`} 
        href="/recipe/list/1"
      >
        <Image src={"/icons/svg/white-book.svg"} alt="an icon for recipe list"/>
        レシピ図鑑
      </Link>

      <Link href={"/columns"} className="w-full hover:opacity-75 px-4 py-1 rounded-full">
        <div className="w-full text-sm flex justify-between items-center">
            <Image src={"/icons/svg/white-paw-print.svg"} alt="an icon for columns/blog"/>
            犬と食に関するコラム
        </div>
      </Link>

      <Link className={`hover:opacity-75 w-full px-4 py-1 rounded-full`} href={`/user/settings/${1}?=#register-pet`}>
        <div className="w-full text-sm flex justify-between items-center">
          <Image src={"/icons/svg/white-paw-print.svg"} alt="an icon for pet registration"/>
          愛犬登録
        </div>
      </Link> */}

      {/* {
        user.user_id !== 0 && (
          <Button onClick={logout}>
            <div  className="w-full hover:opacity-75 text-sm flex justify-between items-center px-4 py-1 rounded-full">
              <SignOut />
              ログアウト
            </div>
          </Button>
        )
      } */}
    </nav>
  )
}