import * as React from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {deleteUser, updateUserLevel} from "@/app/(protected-admin)/admin/dashboard/components/user/user-slice";
import {IconDotsVertical, IconLoader} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {
  Dialog, DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {ClientApiResponseService} from "@/lib/client-utils";
import SpinLoader from "@/components/SpinLoader";
import {
  DeleteMutationType,
  DispatchType,
  UpdateUserLevelMutationType
} from "@/app/(protected-admin)/admin/dashboard/components/columns";

export function UserLevel(
  {
    user_id,
    user_codename,
    updateUserLevelMutation,
    user_lvl,
    dispatch
  }: {
    user_id: number,
    user_codename: string,
    user_lvl: number,
    updateUserLevelMutation: UpdateUserLevelMutationType,
    dispatch: DispatchType,
  }) {
  const [loading, setLoading] = React.useState(() => false);
  return (
    <>
      <Select disabled={updateUserLevelMutation.isPending} onValueChange={async (value: string) => {
        setLoading(true);
        await updateUserLevelMutation.mutateAsync({
          id: user_id,
          name: user_codename,
          level: value
        });
        dispatch(updateUserLevel({
          id: user_id,
          level: Number(value) as 0 | 1 | 2
        }))
        setLoading(false);
      }} defaultValue={String(user_lvl)}>
        <SelectTrigger
          className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
          size="sm"
          id={`${user_lvl}-reviewer`}
        >
          {loading && <IconLoader />} <SelectValue placeholder="Select User Level" />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectItem value="0">Super Admin</SelectItem>
          <SelectItem value="1">
            Admin
          </SelectItem>
          <SelectItem value="2">
            User
          </SelectItem>
        </SelectContent>
      </Select>
    </>
  )
}

export function UserActions(
  {
    user_id,
    user_codename,
    deleteMutation,
    dispatch
  } : {
    user_id: number,
    user_codename: string,
    deleteMutation: DeleteMutationType,
    dispatch: DispatchType
  }) {

  const [dpOpen, setDpOpen] = React.useState(false);
  const [open , setOpen] = React.useState(false);

  return (
    <DropdownMenu open={dpOpen} onOpenChange={setDpOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
          size="icon"
        >
          <IconDotsVertical />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem disabled={true}>Reset Password</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant={"destructive"} asChild={true}>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild={true}>
              <Button className={"w-full justify-start pl-2 py-1.5 h-auto"} variant={"ghostDestructive"}>
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Delete user?</DialogTitle>
              <DialogDescription>Are you sure you want to delete this user?</DialogDescription>
              <DialogFooter>
                <Button
                  variant={"destructive"}
                  onClick={async () => {
                    const response = await deleteMutation.mutateAsync({
                      id: user_id,
                      name: user_codename,
                      type: "users"
                    });
                    const data = ClientApiResponseService.getAxiosResponseData<{id: number}>(response);
                    dispatch(deleteUser(Number(data.id)));
                    setOpen(false);
                    setDpOpen(false);
                  }}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending && <SpinLoader />} Delete
                </Button>
                <DialogClose>Cancel</DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}