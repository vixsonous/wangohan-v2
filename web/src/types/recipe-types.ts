export interface DogData {
  pet_id: number;
  pet_image: string;
  pet_name: string;
  pet_birthdate: string;
  pet_breed: string;
}

export interface ingredients {
  id: number;
  name: string;
  amount: string;
}

export interface instructions {
  id: number;
  text: string;
}

export interface UserDetails {
  pets?: DogData[];
  user_codename: string;
  user_detail_id: number;
  user_id: number;
  user_image: string;
}

export interface User {
  user_id: number;
  user_image: string;
  user_codename: string;
}

export interface Comment {
  recipe_comment_id: number;
  recipe_comment_rating: number;
  recipe_comment_subtext: string;
  recipe_comment_title: string;
  recipe_id: number;
  user_id: number;
  user: User;
  created_at: string;
}