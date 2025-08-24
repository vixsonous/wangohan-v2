import { Generated, Insertable, Selectable, Updateable } from "kysely";

export interface DatabaseTableName {
  users_table: "users_table";
  user_details_table: "user_details_table";
  pets_table: "pets_table";
  allergies_table: "allergies_table";
  recipes_table: "recipes_table";
  recipe_comments_table: "recipe_comments_table";
  recipe_images_table: "recipe_images_table";
  recipe_ingredients_table: "recipe_ingredients_table";
  recipe_instructions_table: "recipe_instructions_table";
  favourites_table: "favourites_table";
  likes_table: "likes_table";
  notifications_table: "notifications_table";
  blog_columns_table: "blog_columns_table";
  blog_images_upload: "blog_images_upload";
}
export interface Database {
  users_table: UserTable;
  user_details_table: UserDetailTable;
  pets_table: PetsTable;
  allergies_table: AllergiesTable;
  recipes_table: RecipesTable;
  recipe_comments_table: RecipeCommentsTable;
  recipe_images_table: RecipeImagesTable;
  recipe_ingredients_table: RecipeIngredientsTable;
  recipe_instructions_table: RecipeInstructionsTable;
  favourites_table: FavouritesTable;
  likes_table: LikesTable;
  notifications_table: NotificationsTable;
  blog_columns_table: BlogColumnsTable;
  blog_images_upload: BlogImagesUpload;
}

export interface UserTable {
  user_id: Generated<number>;
  google_id: string;
  email: string;
  password:string;
  user_lvl: number;
  is_inactive: boolean;
  updated_at: Date;
  created_at: Date;
}

export type UserInsert = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;

export interface UserDetailTable {
  user_detail_id: Generated<number>;
  user_first_name: string;
  user_last_name: string;
  user_codename: string;
  user_image: string;
  user_agreement: number;
  user_gender: string;
  user_birthdate: Date;
  user_id: number;
  user_occupation: string;
  updated_at: Date;
  created_at: Date;
}

export type UserDetailInsert = Insertable<UserDetailTable>;
export type UserDetailUpdate = Updateable<UserDetailTable>;

export interface PetsTable {
  pet_id: Generated<number>;
  pet_name: string;
  pet_birthdate: Date;
  pet_breed: string;
  pet_image: string;
  user_id: number;
  updated_at: Date;
  created_at: Date;
}

export type PetInsert = Insertable<PetsTable>;
export type PetUpdate = Updateable<PetsTable>;

export interface AllergiesTable {
  allergy_id: Generated<number>;
  allergy_name: string;
  allergy_ingredient: string;
  pet_id: number;
  updated_at: Date;
  created_at: Date;
}

export type AllergyInsert = Insertable<AllergiesTable>;
export type AllergyUpdate = Updateable<AllergiesTable>;

export interface RecipesTable {
  recipe_id: Generated<number>;
  recipe_name: string;
  recipe_description: string;
  recipe_age_tag: string;
  recipe_size_tag: string;
  recipe_event_tag: string;
  recipe_category: string;
  total_likes: number;
  total_favourites: number;
  total_views: number;
  user_id: number;
  is_deleted: boolean;
  updated_at: Date;
  created_at: Date;
}

export type RecipeSelect = Selectable<RecipesTable>;
export type RecipeInsert = Insertable<RecipesTable>;
export type RecipeUpdate = Updateable<RecipesTable>;

export interface RecipeCommentsTable {
  recipe_comment_id: Generated<number>;
  recipe_comment_title: string;
  recipe_comment_subtext: string;
  recipe_comment_rating: number;
  user_id: number;
  recipe_id: number;
  updated_at: Date;
  created_at: Date;
}

export type RecipeCommentInsert = Insertable<RecipeCommentsTable>;
export type RecipeCommentUpdate = Updateable<RecipeCommentsTable>;

export interface RecipeImagesTable {
  recipe_image_id: Generated<number>;
  recipe_image_title: string;
  recipe_image_subtext: string;
  recipe_image: string;
  recipe_id: number;
  updated_at: Date;
  created_at: Date;
}

export type RecipeImageInsert = Insertable<RecipeImagesTable>;
export type RecipeImageUpdate = Updateable<RecipeImagesTable>;

export interface RecipeInstructionsTable {
  recipe_instructions_id: Generated<number>;
  recipe_instructions_text: string;
  recipe_id: number;
  updated_at: Date;
  created_at: Date;
}

export type RecipeInstructionInsert = Insertable<RecipeInstructionsTable>;
export type RecipeInstructionUpdate = Updateable<RecipeInstructionsTable>;

export interface RecipeIngredientsTable {
  recipe_ingredient_id: Generated<number>;
  recipe_ingredients_name: string;
  recipe_ingredients_amount: string;
  recipe_id: number;
  updated_at: Date;
  created_at: Date;
}

export type RecipeIngredientInsert = Insertable<RecipeIngredientsTable>;
export type RecipeIngredientUpdate = Updateable<RecipeIngredientsTable>;

export interface FavouritesTable {
  favourite_id: Generated<number>;
  user_id: number;
  recipe_id: number;
  updated_at: Date;
  created_at: Date;
}

export type FavouriteInsert = Insertable<FavouritesTable>;
export type FavouriteUpdate = Updateable<FavouritesTable>;

export interface LikesTable {
  like_id: Generated<number>;
  user_id: number;
  recipe_id: number;
  is_liked: boolean;
  updated_at: Date;
  created_at: Date;
}

export type LikeInsert = Insertable<LikesTable>;
export type LikeUpdate = Updateable<LikesTable>;

export interface NotificationsTable {
  notification_id: Generated<number>;
  user_id: number;
  recipe_owner_id: number;
  notification_content: string;
  is_read: boolean;
  type: string;
  liked: boolean;
  recipe_id: number;
  recipe_image: string;
  updated_at: Date;
  created_at: Date;
}

export type NotificationInsert = Insertable<NotificationsTable>;
export type NotificationUpdate = Updateable<NotificationsTable>;
export interface BlogColumnsTable {
  blog_id: Generated<number>;
  user_id: number;
  title: string;
  blog_image: string;
  blog_category: string;
  editor_state: JSON;
  is_deleted: boolean;
  updated_at: Date;
  created_at: Date;
}

export type BlogInsert = Insertable<BlogColumnsTable>;
export type BlogUpdate = Updateable<BlogColumnsTable>;

export interface BlogImagesUpload {
  blog_image_id: Generated<number>;
  blog_image_title: string;
  blog_image_url: string;
  updated_at: Date;
  created_at: Date;
}

export type BlogImageInsert = Insertable<BlogImagesUpload>;
export type BlogImageUpdate = Updateable<BlogImagesUpload>;