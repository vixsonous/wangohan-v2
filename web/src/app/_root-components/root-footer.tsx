import Image from "@/components/Image/server";
import Link from "next/link";

export default async function RootFooter() {
  const user = {user_id: 0}
  return (
    <footer className="footer mt-[100px]">
      <hr className="border-[1px] border-black overflow-hidden " />
      <div className="relative  bg-contain bg-no-repeat bg-bottom">
        <div className="grid grid-cols-12 p-4 md:pt-16">
          <div className="col-span-6 md:col-span-4 ">
            <a target="_blank" href="https://www.instagram.com/rei_wangohan?igsh=MTRtcHIzaGQydTg0" className="flex flex-col justify-center items-center w-full">
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" className="w-[40px] md:w-[60px] h-[40px] md:h-[60px]" viewBox="0 0 50 50">
                <path d="M 16 3 C 8.8324839 3 3 8.8324839 3 16 L 3 34 C 3 41.167516 8.8324839 47 16 47 L 34 47 C 41.167516 47 47 41.167516 47 34 L 47 16 C 47 8.8324839 41.167516 3 34 3 L 16 3 z M 16 5 L 34 5 C 40.086484 5 45 9.9135161 45 16 L 45 34 C 45 40.086484 40.086484 45 34 45 L 16 45 C 9.9135161 45 5 40.086484 5 34 L 5 16 C 5 9.9135161 9.9135161 5 16 5 z M 37 11 A 2 2 0 0 0 35 13 A 2 2 0 0 0 37 15 A 2 2 0 0 0 39 13 A 2 2 0 0 0 37 11 z M 25 14 C 18.936712 14 14 18.936712 14 25 C 14 31.063288 18.936712 36 25 36 C 31.063288 36 36 31.063288 36 25 C 36 18.936712 31.063288 14 25 14 z M 25 16 C 29.982407 16 34 20.017593 34 25 C 34 29.982407 29.982407 34 25 34 C 20.017593 34 16 29.982407 16 25 C 16 20.017593 20.017593 16 25 16 z"></path>
              </svg>
              <h1 className="text-[13px] md:text-lg font-bold text-[#523636]">Instagramをフォロー</h1>
              <span className="text-[10px] md:text-xs font-bold text-[#523636]">あなたのレシピがシェア</span>
              <span className="text-[10px] md:text-xs font-bold text-[#523636]">されるかも？！</span>
            </a>
          </div>
          <div className="col-span-6 flex flex-wrap md:grid grid-cols-3 md:col-span-4 md:col-start-8 gap-2 gap-y-2 md:gap-4 justify-between items-center self-center w-[100%]">
            <Link href="/terms" className="text-[8px] md:text-xs self-center flex">利用規約</Link>
            <Link href="/disclaimer" className="text-[8px] md:text-xs self-center flex">免責事項</Link>
            <Link href="/privacy" className="text-[8px] md:text-xs self-center flex">プライバシーポリシー</Link>
            <Link href={user.user_id !== 0 ? `/user/${user.user_id}` : '/login'} className="text-[8px] md:text-xs self-center flex">Myページ</Link>
            <Link href="/" className="text-[8px] md:text-xs self-center flex">HOME</Link>
            <Link href="/send-inquiry" className="text-[8px] md:text-xs self-center flex">ご意見・お問い合わせ</Link>
          </div>
        </div>
        <h1 className="w-[100%] flex justify-center absolute  md:bottom-16 text-[10px] md:text-sm">@Web5Dimensional</h1>
        <Image src="/banner/footer.webp" noprocess className="w-full" alt="" />
      </div>
    </footer>
  )
}