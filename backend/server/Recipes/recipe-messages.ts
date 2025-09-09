
export class RecipeSuccessMessage {
  static SUCCESS_WEEKLY_RECIPE= "Successfully retrieved weekly recipes!";
  static SUCCESS_POPULAR_RECIPE= "Successfully retrieved popular recipes!";
  static SUCCESS_GET_RECIPE= "Successfully retrieved the recipe!";
  static SUCCESS_POST_RECIPE= "Successfully posted recipe!";
  static UPDATE_RECIPE = "Successfully updated the recipe!";
  static RETRIEVE_RECIPES = "Successfully retrieved recipes.";
  static RETRIEVE_LIKED_RECIPES = "Successfully retrieved liked recipes!";
  static RETRIEVE_OWNED_RECIPES = "Successfully retrieved owned recipes!";
  static ARCHIVED_RECIPES = "Successfully retrieved archived recipes!";
  static ARCHIVE_RECIPE = "Successfully archived the recipe!";
  static UNARCHIVE_RECIPE = "Successfully unarchived the recipe!";
  static DELETE_RECIPE = "Successfully deleted recipe!";
  static VIEW_RECIPE = "Successfully viewed the recipe!";
  static IS_LIKED_RECIPE = "Successfully retrieved is liked recipe!";
  static LIKE_RECIPE = "Successfully liked recipe!";
  static UNLIKE_RECIPE = "Successfully unliked recipe!";
  static POST_COMMENT = "Successfully posted a comment!";
  static RETRIEVE_COMMENTS = "Successfully retrieved comments!";
}

export class RecipeErrorMessage {
  static INVALID_RECIPE_ID = "Recipe ID is not valid!";
  static INVALID_RECIPE_NAME = "Recipe name is not valid!";
  static UNSUCCESSFUL_RECIPE_RETRIEVAL = "Recipe is not found!";
  static UNAUTHORIZED = "Unauthorized!";
  static RECIPE_UPLOAD_FAILED = "Failed to upload recipe!";
  static RETRIEVE_RECIPES = "Failed to retrieve recipes!";
  static RETRIEVE_LIKED_RECIPES = "Failed to retrieve liked recipes!";
  static RETRIEVE_OWNED_RECIPES = "Failed to retrieve owned recipes!";
  static ARCHIVED_RECIPES = "Failed to retrieve archived recipes!";
  static ARCHIVE_RECIPE = "Failed to archive the recipe!";
  static UNARCHIVE_RECIPE = "Failed to unarchive the recipe!";
  static DELETE_RECIPE = "Failed to delete recipe!";
  static INVALID_PAGE = "Invalid page number!";
  static VIEW_RECIPE = "Error updating view count of recipe!";
  static LIKE_RECIPE = "Failed to like recipe!";
  static OWNER_DATA = "Failed to retrieve recipe owner data!";
  static NOTIFICATION_INSERT = "Failed to insert notification!";
  static POST_COMMENT = "Failed to insert comment!";
  static RETRIEVE_COMMENTS = "Failed to retrieve recipes comments!";
}

export class RecipeUnauthorizedMessage {
  static LOGIN_REQUIRED = "Login required!";
  static UNAUTHORIZED_EDIT = "Unauthorized to edit this recipe!";
  static UNAUTHORIZED_ARCHIVE = "Unauthorized to archive this recipe!";
  static UNAUTHORIZED_DELETE = "Unauthorized to delete this recipe!";
  static UNAUTHORIZED_NOTIFICATION = "Unauthorized user given for notification!";
  static USER_DISCONNECT = "User disconnected";
}