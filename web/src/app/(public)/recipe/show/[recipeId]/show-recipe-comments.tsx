import Button from "@/components/Button";
import StarReviews from "@/components/StarReviews";
import { Comment } from "@/types/recipe-types"
import Link from "next/link";

interface ShowRecipeCommentsProps {
  comments: Array<Comment>;
  total_comments: number;
}

export default async function ShowRecipeComments({comments, total_comments}: ShowRecipeCommentsProps) {
  return (
    <div className="reviews flex flex-col gap-[20px]">
      {
        comments.map((com, idx) => {
          return (
            <div key={idx} className="review-comment flex w-[100%] gap-[10px]">
              <div className="avatar">
                <Link href={`/user/${com.user.user_id}`}>
                  <img src={com.user.user_image} className="relative top-[5px] w-[30px] rounded-full object-cover overflow-hidden h-[30px] max-w-none" width={10000} height={10000} alt="website banner" />
                </Link>
              </div>
              <div className="comment-container w-[100%] flex flex-col justify-center">
                <div className="upper-content flex justify-between items-center text-[10px] h-[40px]">
                  <div className="name-stars flex items-center justify-center self-center gap-[10px]">
                    {com.user.user_codename}
                    <StarReviews value={com.recipe_comment_rating} interactive={false}/>
                  </div>
                  <div className="date">
                    {com.created_at}
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
        total_comments > 10 && (
          <Button className="text-[10px] ml-[50px] flex gap-[10px] items-center">
            全てのレビューを見る
          </Button>
        )
      }
    </div>
  )
}