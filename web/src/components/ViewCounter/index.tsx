"use client";

import {useEffect} from "react";
import {ClientApiService} from "@/lib/client-utils";

const SECOND = 1000;
const VIEW_TIMEOUT = 10;
export default function ViewCounter({recipe_id}: {recipe_id: number}) {
  useEffect(() => {
    const countDown = setTimeout(async () => {
      await ClientApiService.get("/viewed-recipe?recipe_id=" + recipe_id);
    }, VIEW_TIMEOUT * SECOND);

    return () => clearTimeout(countDown);
  }, []);
  return null;
}