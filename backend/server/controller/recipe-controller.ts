import { Request, Response } from "express";

export class RecipeController {
  static async getRecipe(req: Request, res: Response) {
    res.send("Hello qweqweqwe!");
  }
}