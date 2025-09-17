import {Router} from "express";
import multer from "multer";
import {PetController} from "@/server/Pet/pet-controller";

const upload = multer({dest: 'uploads/', storage: multer.memoryStorage()});

export const petRouter = Router();

petRouter.post("/", upload.single('pet_image'), PetController.postPet);
petRouter.get("/birthday", PetController.getBirthdayMonthPets);