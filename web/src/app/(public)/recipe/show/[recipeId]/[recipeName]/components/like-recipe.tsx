"use client";
import Button from "@/components/Button";
import Image from "@/components/Image/client";
import {QueryClientProvider, useMutation} from "@tanstack/react-query";
import {queryClient} from "@/lib/tanstack-query";
import { ClientApiService} from "@/lib/client-utils";
import {useState} from "react";

type LikeButtonProps = {
  total_likes: number;
  recipe_id: number;
  is_liked: boolean;
  recipe_name: string;
}

function LikeButton({total_likes, recipe_id, is_liked, recipe_name}: LikeButtonProps) {
  const [liked, setLiked] = useState(is_liked);
  const [likes, setLikes] = useState(total_likes);
  const likeMutation = useMutation({
    mutationFn: () => ClientApiService.get("/like-recipe?recipe_id=" +recipe_id + "&is_liked=" + !liked + "&recipe_name=" + recipe_name + "&notification_date=" + new Date().toLocaleString()),
    onSuccess: () => {
      setLiked(prev => !prev);
      setLikes(prev => liked ? prev - 1 : prev + 1);
  }
  })
  return (
    <Button onClick={() => likeMutation.mutate()} className={"flex items-center text-xs self-center w-20 py-1 px-2 justify-between bg-secondary-bg rounded-full"}>
      <Image height={20} width={20} className={`h-5 w-5 ${liked ? "animate-[bubble_1s_forwards]" : ""}`} noprocess src={liked ? "/icons/svg/red-heart-fill.svg": "/icons/svg/primary-heart.svg"} alt="heart icon for liked recipes"/>
      <span className="font-semibold text-primary-text">
        {likes >= 1000 ? `${likes / 1000}k` : likes}
      </span>
    </Button>
  )
}

type LikeRecipeProps = {
  total_likes: number;
  recipe_id: number;
  is_liked: boolean;
  recipe_name: string;
}

export default function LikeRecipe({ total_likes, recipe_id, is_liked , recipe_name}: LikeRecipeProps) {

  return (
    <QueryClientProvider client={queryClient}>
      <LikeButton total_likes={total_likes} recipe_id={recipe_id} is_liked={is_liked} recipe_name={recipe_name} />
    </QueryClientProvider>
  )
}