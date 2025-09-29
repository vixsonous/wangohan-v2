import {useMutation, UseMutationResult} from "@tanstack/react-query";
import {toast} from "sonner";
import {ENDPOINTS} from "@/constants/endpoints";
import {useDispatch} from "react-redux";
import {ClientApiResponseService, ClientApiService} from "@/lib/client-utils";
import {AxiosError, AxiosResponse} from "axios";
import { store} from "@/store/store";

export type PublishState = "published" | "unpublished" | "loading";
export type MutationTypes = "recipes" | "blogs" | "users" | "comments";
export type UserLevels = "2" | "1" | "0";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PublishMutationType = UseMutationResult<AxiosResponse<any, any>, AxiosError<unknown, any>, {
  id: number
  publish: boolean
  type: "recipes" | "blogs"
}>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DeleteMutationType = UseMutationResult<AxiosResponse<any, any>, AxiosError<unknown, any>, {
  id: number
  name: string
  type: MutationTypes
}>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UpdateUserLevelMutationType = UseMutationResult<AxiosResponse<any, any>, AxiosError<unknown, any>, {
  id: number
  name: string
  level: string
}, unknown>

export type DispatchType = typeof store.dispatch;

export const useColumns = () => {

  const deleteMutation = useMutation({
    mutationFn: (data: {id: number, name: string, type: MutationTypes}) =>
      ClientApiService.delete(ENDPOINTS.ADMIN + `/${data.type}/${data.id}?` +
        (
          (data.type === "recipes" && `recipe_name=${data.name}`) ||
          (data.type === "blogs" && `title=${data.name}`) ||
          (data.type === "users" && `user_codename=${data.name}`)
        )
      ),
    onSuccess: (response: AxiosResponse) => {
      const message = ClientApiResponseService.getAxiosResponseMessage(response);
      toast.success("Successful!", {description: message});


    },
    onError: (error: AxiosError) => {
      const message = ClientApiResponseService.getAxiosErrorMessage(error);
      toast.error("Error!", {description: message});
    }
  });

  const publishMutation = useMutation({
    mutationFn: (data: {id: number, publish: boolean, type: "recipes" | "blogs"}) => ClientApiService.patch(ENDPOINTS.ADMIN + "/"+data.type+"/status/publish", data),
    onSuccess: (response: AxiosResponse) => {
      const message = ClientApiResponseService.getAxiosResponseMessage(response);
      const data = ClientApiResponseService.getAxiosResponseData<{id: number, publish: boolean}>(response);
      toast.success("Successful!", {description: message});
      return data;
    },
    onError: (error: AxiosError) => {
      const message = ClientApiResponseService.getAxiosErrorMessage(error);
      toast.error("Error!", {description: message});
    }
  });

  const updateUserLevelMutation = useMutation({
    mutationFn: (data: {id: number, name: string, level: string}) =>
      ClientApiService.patch(ENDPOINTS.ADMIN + `/users/${data.id}/level?user_codename=${data.name}&user_level=${data.level}`),
    onSuccess: (response: AxiosResponse) => {
      const message = ClientApiResponseService.getAxiosResponseMessage(response);
      const data = ClientApiResponseService.getAxiosResponseData<{id: number, level: UserLevels}>(response);
      toast.success("Successful!", {description: message});
      return data;
    },
    onError: (error: AxiosError) => {
      const message = ClientApiResponseService.getAxiosErrorMessage(error);
      toast.error("Error!", {description: message});
    }
  });

  return {
    publishMutation,
    deleteMutation,
    updateUserLevelMutation,
  }
}

