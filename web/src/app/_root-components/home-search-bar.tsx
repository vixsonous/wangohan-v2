import Image from "@/components/Image/server";
import { Input } from "@/components/ui/input";

export default function HomeSearchBar() {
  
  const action = async (formData: FormData) => {
    "use server";
    
    const search = formData.get("search");
  }
  return (
    <form suppressHydrationWarning action={action} className="relative w-full flex items-center max-w-[170px] sm:max-w-[250px] md:max-w-[500px]">
      <Input 
        className={`py-2 px-4 w-full border border-primary-text rounded-md text-xs md:text-sm bg-secondary-bg`} 
        placeholder="キーワードでレシピを検索"
        name="search"
        type="text" 
      />
      <button type="submit" className="absolute right-2">
        <Image noprocess preload src={"/icons/svg/primary-magnifying-glass.svg"} alt="an icon for search bar"/>
      </button>
    </form>
  )
}