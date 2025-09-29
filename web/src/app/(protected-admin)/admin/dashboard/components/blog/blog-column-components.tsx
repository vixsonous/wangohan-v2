import * as React from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {ClientApiResponseService} from "@/lib/client-utils";
import {deleteBlog, setPublishBlog} from "@/app/(protected-admin)/admin/dashboard/components/blog/blog-slice";
import {IconCircleCheckFilled, IconCircleXFilled, IconDotsVertical, IconLoader} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {
  Dialog, DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import SpinLoader from "@/components/SpinLoader";
import {
  DeleteMutationType,
  DispatchType,
  PublishMutationType,
  PublishState
} from "@/app/(protected-admin)/admin/dashboard/components/columns";

export function BlogPublish(
  {
    blog_id,
    is_published,
    publishMutation,
    dispatch
  }: {
    blog_id: number,
    is_published: boolean,
    publishMutation: PublishMutationType,
    dispatch: DispatchType
  }) {
  const [isPublished, setIsPublished] = React.useState<PublishState>(() => is_published ? "published" : "unpublished");
  return (
    <>
      <Select
        disabled={publishMutation.isPending}
        onValueChange={async (value: string) => {
          setIsPublished("loading");
          const response = await publishMutation.mutateAsync({id: blog_id, publish: value === "publish", type: "blogs"});
          const data = ClientApiResponseService.getAxiosResponseData<{id: number, publish: boolean}>(response);
          dispatch(setPublishBlog(data));
          setIsPublished(data.publish ? "published" : "unpublished");
        }}
        defaultValue={is_published ? "publish" : "unpublish"}
      >
        <SelectTrigger
          className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
          size="sm"
          id={`${is_published}-reviewer`}
        >
          {isPublished === "published" && <IconCircleCheckFilled className={"fill-green-500 dark:fill-green-400"} />}
          {isPublished === "unpublished" && <IconCircleXFilled className={"fill-red-500 dark:fill-red-400"} />}
          {isPublished === "loading" && <IconLoader className={"animate-spin"} />}
          <SelectValue placeholder="Publish Recipe" />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectItem value="publish" className={"flex gap-2 items-center"}>
            Publish
          </SelectItem>
          <SelectItem value="unpublish">
            Unpublish
          </SelectItem>
        </SelectContent>
      </Select>
    </>
  )
}

export function BlogActions(
  {
    blog_id,
    title,
    deleteMutation,
    dispatch
  }:{
    blog_id: number,
    title: string,
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
        <DropdownMenuItem>
          <Link className={"w-full"} href={`/columns/edit/${blog_id}/${title}`}>
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant={"destructive"} asChild={true}>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild={true}>
              <Button className={"w-full justify-start pl-2 py-1.5 h-auto"} variant={"ghostDestructive"}>
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Delete blog?</DialogTitle>
              <DialogDescription>Are you sure you want to delete this blog?</DialogDescription>
              <DialogFooter>
                <Button
                  variant={"destructive"}
                  onClick={async () => {
                    const response = await deleteMutation.mutateAsync({
                      id: blog_id,
                      name: title,
                      type: "blogs"
                    });
                    const data = ClientApiResponseService.getAxiosResponseData<{id: number}>(response);
                    dispatch(deleteBlog(Number(data.id)));
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