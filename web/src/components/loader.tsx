import PawLoading from "@/components/paw-loading";

export default function Loader() {
  return (
    <div className={"w-full min-h-[100px] min-w-[100px] flex justify-center items-center h-full"}>
      <PawLoading />
    </div>
  )
}