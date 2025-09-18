"use client";

import {useEffect} from "react";
import {ClientApiService} from "@/lib/client-utils";
import {ENDPOINTS} from "@/constants/endpoints";

const SECOND = 1000;
const VIEW_TIMEOUT = 10;
export default function ViewCounter({recipe_id}: {recipe_id: number}) {
  useEffect(() => {
    const countDown = setTimeout(async () => {
      await ClientApiService.patch(ENDPOINTS.RECIPE + "/" + recipe_id +"/views");
    }, VIEW_TIMEOUT * SECOND);

    return () => clearTimeout(countDown);
  }, [recipe_id]);
  return null;
}