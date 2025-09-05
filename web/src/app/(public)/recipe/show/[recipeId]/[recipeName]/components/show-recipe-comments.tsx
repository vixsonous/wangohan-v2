"use client"
import Button from "@/components/Button";
import Image from "@/components/Image/client";
import StarReviews from "@/components/StarReviews";
import Link from "next/link";
import z from "zod";
import {RecipeDisplaySchema} from "@/types/recipe-types";
import { useEffect, useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {ClientApiResponseService, ClientApiService} from "@/lib/client-utils";
import {AxiosError, AxiosResponse} from "axios";
import {toast} from "sonner";
import {useDispatch, useSelector} from "react-redux";
import {addComments, setComments} from "@/app/(public)/recipe/show/[recipeId]/[recipeName]/components/comments-slice";
import {RootState} from "@/store/store";

type ShowRecipeCommentsProps = {
  comments: Array<z.infer<typeof RecipeDisplaySchema.RecipeDetailsDisplayComments>>;
  total_comments: number;
  recipe_id: number;
}

const COMMENT_FIRST_PAGE = 1;

export default function ShowRecipeComments({comments, total_comments, recipe_id}: ShowRecipeCommentsProps) {

  const [page, setPage] = useState(COMMENT_FIRST_PAGE);
  const dispatch = useDispatch();
  const stateComments = useSelector((state: RootState) => state.comments);

  useEffect(() => {
    dispatch(setComments(comments));
  }, [comments, dispatch]);

  const getMoreCommentsMutation = useMutation({
    mutationFn: ({recipe_id, page}: {recipe_id: number, page: number}) => ClientApiService.get("/get-comments?recipe_id=" + recipe_id + "&page=" + page),
    onSuccess: (response: AxiosResponse) => {
      const data = ClientApiResponseService.getAxiosResponseData<Array<z.infer<typeof RecipeDisplaySchema.RecipeDetailsDisplayComments>>>(response);
      dispatch(addComments(data));
      const message = ClientApiResponseService.getAxiosResponseMessage(response);
      toast.success("Successful!", {description: message});
      setPage(prev => prev + 1);
    },
    onError: (error: AxiosError) => {
      const message = ClientApiResponseService.getAxiosErrorMessage(error);
      toast.error("Error!", {description: message});
    }
  })

  return (
    <div className="reviews flex flex-col gap-[20px]">
      {
        stateComments.map((com, idx) => {
          return (
            <div key={idx} className="review-comment flex w-[100%] gap-[10px]">
              <div className="avatar">
                <Link href={`/user/${com.user?.user_id}/${com.user?.user_codename}`}>
                  <Image src={com.user?.user_image} className="relative top-[5px] w-[30px] rounded-full object-cover overflow-hidden h-[30px] max-w-none" width={30} height={30} alt="website banner" />
                </Link>
              </div>
              <div className="comment-container w-[100%] flex flex-col justify-center">
                <div className="upper-content flex justify-between items-center text-[10px] h-[40px]">
                  <div className="name-stars flex items-center justify-center self-center gap-[10px]">
                    {com.user?.user_codename}
                    <StarReviews value={com.recipe_comment_rating} interactive={false}/>
                  </div>
                  <div className="date">
                    {new Date(com.created_at.toString().replace("Z","")).toLocaleString()}
                  </div>
                </div>
                <div className="lower-content whitespace-pre-wrap rounded-md text-[10px] bg-[#fef1dd] p-[10px]">
                  <span>{com.recipe_comment_subtext}</span>
                </div>
              </div>
            </div>
          )
        })
      }
      {
        stateComments.length < total_comments && (
          <Button onClick={() => getMoreCommentsMutation.mutate({recipe_id: recipe_id, page: page})} className="text-[10px] ml-[50px] flex gap-[10px] items-center">
            全てのレビューを見る
          </Button>
        )
      }
    </div>
  )
}