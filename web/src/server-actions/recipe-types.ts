export interface RecipeRatingData {
  avg_rating: number;
  total_rating: number;
}

export interface RecipeDisplayDetails {
  recipe_name: string;
  recipe_uuid: number;
  recipe_description: string;
  recipe_age_tag: string;
  recipe_size_tag: string;
  recipe_event_tag: string;
  recipe_category: string;
  total_likes: number;
  total_views: number;
  recipe_images: Array<RecipeImageDisplay>;
  recipe_rating_data: RecipeRatingData | null;
  user_id: number;
  created_at: Date;
}

export interface RecipeImageDisplay {
  recipe_image_id: number;
  recipe_image_title: string;
  recipe_image_subtext: string;
  recipe_image: string;
  recipe_id: number;
}