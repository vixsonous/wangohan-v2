import BirthdayAvatars from "./birthday-avatars";
import z from "zod";
import {PetSchema} from "@/types/pet-types.pet";

export default async function BirthdayWrapper({birthday_pets}: {birthday_pets: Array<z.infer<typeof PetSchema.GetPet>>}) {
  return (
    <section className="w-full mt-20">
      <header className="relative pb-4 flex justify-center">
        <h1
          className={`text-2xl z-10 max-w-max px-4 font-bold tracking-tighter inline-block text-primary-text relative bg-primary-bg`}
        >
          今月お誕生日のわんちゃん
        </h1>
        <p className="absolute w-full top-5/12 border border-solid border-primary-text" />
      </header>
      <BirthdayAvatars birthday_pets={birthday_pets} />
      <div className="mt-4 relative flex justify-center">
        <video src="/video/birthdayanimation.mp4" autoPlay playsInline muted controls={false} loop></video>
      </div>
    </section>
  )
}