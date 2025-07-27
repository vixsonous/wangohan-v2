import SignupWrapper from "./_signup-components/signup-wrapper";

export default async function Signup() {
  return (
    <div className=" flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <SignupWrapper />
      </div>
    </div>
  )
}