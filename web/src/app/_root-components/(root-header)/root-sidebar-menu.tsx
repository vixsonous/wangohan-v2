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
import {ROUTES} from "@/constants/routes";

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
    {text: "犬と食に関するコラム", show: true, condition: pathname.includes("/columns/list") , href: ROUTES.COLUMNS, src: "/icons/svg/white-article.svg", alt: "an icon for columns/blog", type: "link"},
    {text: "愛犬登録", show: true, condition: pathname.includes("/user/settings/"), href: user_data === undefined ? "/login" : `/user/${user_data?.user_id}/${user_data?.user_details?.user_codename}?register_pet=true`, src: "/icons/svg/white-paw-print.svg", alt: "an icon for pet registration", type: "link"},
    {text: "ブログを作成する", show: user_data?.user_lvl === 2, condition: pathname.includes("/columns/create"), href: "/columns/create", src: "/icons/svg/white-simple-pencil.svg", alt: "an icon for blog creation", type: "link"},
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
    </nav>
  )
}