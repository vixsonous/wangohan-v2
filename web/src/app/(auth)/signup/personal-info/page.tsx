import Image from "@/components/Image/server";
import PersonalInfoFormWrapper from "@/app/(auth)/signup/personal-info/personal-info-form-wrapper";
import {redirect} from "next/navigation";
import {isAuthenticated} from "@/server-actions/User/user";

export default async function PersonalInfoRegistration() {

  const userData = await isAuthenticated();

  if(userData === undefined) {
    redirect("/login");
  }

  if(userData.user_details !== null) {
    redirect("/user/" + userData.user_details.user_id + "/" + userData.user_details.user_codename);
  }

  return (
    <div className={`flex flex-col px-[50px] py-[30px] gap-[10px] justify-center items-center w-full`}>
      <div className="flex justify-center items-center relative">
        <h1 className="absolute top-[10px] font-semibold text-[#523636]">新規登録</h1>
        <Image src={'/banner/ribbon.webp'} className="h-[auto] w-[200px] sm:w-[300px] max-w-none" width={300}  alt="website banner" />
      </div>
      <h1 className="text-[8px] sm:text-[12px] mt-[20px] font-bold">メールアドレスで新規登録</h1>
      <PersonalInfoFormWrapper user_id={userData.user_id} />
    </div>
  )
}