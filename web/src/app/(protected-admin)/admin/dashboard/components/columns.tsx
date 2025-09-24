import {ColumnDef} from "@tanstack/react-table";
import z from "zod";
import {AdminRecipeSchema} from "@/types/recipe-types";
import {Checkbox} from "@/components/ui/checkbox";
import TableCellViewer from "@/app/(protected-admin)/admin/dashboard/components/table-cell-viewer";
import {Badge} from "@/components/ui/badge";
import {useMutation} from "@tanstack/react-query";
import {toast} from "sonner";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import Link from "next/link";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {ENDPOINTS} from "@/constants/endpoints";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconDotsVertical,
  IconGripVertical,
  IconLoader
} from "@tabler/icons-react";
import * as React from "react";
import {useSortable} from "@dnd-kit/sortable";
import {AdminBlogSchema} from "@/types/blog-types";
import {AdminUserSchema} from "@/types/user-types.user";
import {useDispatch} from "react-redux";
import {
  deleteRecipe,
  setPublishRecipe
} from "@/app/(protected-admin)/admin/dashboard/components/recipe/recipe-slice";
import {setPublishBlog} from "@/app/(protected-admin)/admin/dashboard/components/blog/blog-slice";
import {ClientApiResponseService, ClientApiService} from "@/lib/client-utils";
import {AxiosError, AxiosResponse} from "axios";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import SpinLoader from "@/components/SpinLoader";
import {useRouter} from "next/navigation";

type PublishState = "published" | "unpublished" | "loading";

export const useColumns = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const deleteRecipeMutation = useMutation({
    mutationFn: (data: {id: number, name: string}) => ClientApiService.delete(ENDPOINTS.ADMIN + "/recipes/" + data.id + "?recipe_name=" + data.name),
    onSuccess: (response: AxiosResponse) => {
      const message = ClientApiResponseService.getAxiosResponseMessage(response);
      const data = ClientApiResponseService.getAxiosResponseData<{id: number}>(response);
      toast.success("Successful!", {description: message});

      dispatch(deleteRecipe(Number(data.id)));
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

// Create a separate component for the drag handle
  function DragHandle({ id }: { id: number }) {
    const { attributes, listeners } = useSortable({
      id,
    })

    return (
      <Button
        {...attributes}
        {...listeners}
        variant="ghost"
        size="icon"
        className="text-muted-foreground size-7 hover:bg-transparent"
      >
        <IconGripVertical className="text-muted-foreground size-3" />
        <span className="sr-only">Drag to reorder</span>
      </Button>
    )
  }

  const recipeColumns: ColumnDef<z.infer<typeof AdminRecipeSchema.Recipe>>[] = [
    {
      id: "drag",
      header: () => null,
      cell: ({ row }) => <DragHandle id={row.original.recipe_id} />,
    },
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "recipe_name",
      header: "Recipe Name",
      cell: ({ row }) => {
        return <TableCellViewer item={row.original} />
      },
      enableHiding: false,
    },
    {
      accessorKey: "total_likes",
      header: () => <div className="w-full text-center">Total Likes</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Badge variant="outline" className="text-muted-foreground px-1.5 text-center">
            {row.original.total_likes}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "total_views",
      header: () => <div className="w-full text-center">Total Views</div>,
      cell: ({ row }) => (
        <div className={"w-full flex items-center justify-center"}>
          <Badge variant="outline" className="text-muted-foreground px-1.5 text-center">
            {row.original.total_views}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "recipe_rating_data",
      header: () => <div className="w-full text-center">Ratings</div>,
      cell: ({ row }) => (
        <div className={"w-full flex items-start justify-start flex-col gap-1"}>
          <p className={"flex gap-2 items-center justify-start"}>
            <span className={"text-xs"}>Total Rating</span>
            <Badge variant="outline" className="text-muted-foreground px-1.5 text-left">
              {row.original.recipe_rating_data?.total_rating || 0}
            </Badge>
          </p>
          <p className={"flex gap-2 items-center justify-start"}>
            <span className={"text-xs"}>Rating</span>
            <Badge variant="outline" className="text-muted-foreground px-1.5 text-center">
              {row.original.recipe_rating_data?.avg_rating || 0}
            </Badge>
          </p>
        </div>
      ),
    },
    {
      accessorKey: "is_published",
      header: "Published Status",
      cell: ({ row }) => {
        const [isPublished, setIsPublished] = React.useState<PublishState>(() => row.original.is_published ? "published" : "unpublished");
        return (
          <>
            <Select disabled={publishMutation.isPending} onValueChange={async (value: string) => {
              setIsPublished("loading")
              const response = await publishMutation.mutateAsync({
                id: row.original.recipe_id,
                publish: value === "publish",
                type: "recipes"
              });

              const data = ClientApiResponseService.getAxiosResponseData<{id: number, publish: boolean}>(response);
              dispatch(setPublishRecipe(data));
              setIsPublished(data.publish ? "published" : "unpublished");
            }} defaultValue={row.original.is_published ? "publish" : "unpublish"}>
              <SelectTrigger
                className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                size="sm"
                id={`${row.original.is_published}-reviewer`}
              >
                {isPublished === "published" && <IconCircleCheckFilled className={"fill-green-500 dark:fill-green-400"} />}
                {isPublished === "unpublished" && <IconCircleXFilled className={"fill-red-500 dark:fill-red-400"} />}
                {isPublished === "loading" && <IconLoader className={"animate-spin"} />}
                <SelectValue placeholder="Publish Recipe" />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="publish">Publish</SelectItem>
                <SelectItem value="unpublish">
                  Unpublish
                </SelectItem>
              </SelectContent>
            </Select>
          </>
        )
      },
    },
    {
      accessorKey: "user",
      header: () => <div className="w-full text-left">User</div>,
      cell: ({ row }) => (
        <Link href={`/user/${row.original.user?.user_id}/${row.original.user?.user_codename}`} className={"w-full flex justify-start gap-2"}>
          <Avatar>
            <AvatarImage src={`${process.env.NEXT_PUBLIC_ORIGIN}/api${ENDPOINTS.IMAGE}/transform?src=${(row.original.user && row.original.user.user_image)}&w=32&h=32`} />
          </Avatar>
          <Badge variant="outline" className="text-muted-foreground px-1.5">
            {row.original.user && row.original.user.user_codename}
          </Badge>
        </Link>
      ),
    },
    {
      id: "actions",
      cell: ({row}) => {

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
              <DropdownMenuItem asChild={true}>
                <Link href={`/recipe/edit/${row.original.recipe_id}/${row.original.recipe_name}`}>
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Make a copy</DropdownMenuItem>
              <DropdownMenuItem variant={"destructive"}>Favorite</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant={"destructive"} asChild={true}>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild={true}>
                    <Button className={"w-full justify-start pl-2 py-1.5 h-auto"} variant={"ghostDestructive"}>
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>Delete recipe?</DialogTitle>
                    <DialogDescription>Are you sure you want to delete this recipe?</DialogDescription>
                    <DialogFooter>
                      <Button
                        variant={"destructive"}
                        onClick={async () => {
                          await deleteRecipeMutation.mutateAsync({
                            id: row.original.recipe_id,
                            name: row.original.recipe_name,
                          });
                          setOpen(false);
                          setDpOpen(false);
                        }}
                        disabled={deleteRecipeMutation.isPending}
                      >
                        {deleteRecipeMutation.isPending && <SpinLoader />} Delete
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
    },
  ]

  const blogColumns: ColumnDef<z.infer<typeof AdminBlogSchema.Blog>>[] = [
    {
      id: "drag",
      header: () => null,
      cell: ({ row }) => <DragHandle id={row.original.blog_id} />,
    },
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: "Blog Title",
      cell: ({ row }) => {
        return <TableCellViewer item={row.original} />
      },
      enableHiding: false,
    },
    {
      accessorKey: "is_published",
      header: "Published Status",
      cell: ({ row }) => {
        const [isPublished, setIsPublished] = React.useState<PublishState>(() => row.original.is_published ? "published" : "unpublished");
        return (
          <>
            <Select
              disabled={publishMutation.isPending}
              onValueChange={async (value: string) => {
                setIsPublished("loading");
                const response = await publishMutation.mutateAsync({id: row.original.blog_id, publish: value === "publish", type: "blogs"});
                const data = ClientApiResponseService.getAxiosResponseData<{id: number, publish: boolean}>(response);
                dispatch(setPublishBlog(data));
                setIsPublished(data.publish ? "published" : "unpublished");
              }}
              defaultValue={row.original.is_published ? "publish" : "unpublish"}
            >
              <SelectTrigger
                className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                size="sm"
                id={`${row.original.is_published}-reviewer`}
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
      },
    },
    {
      id: "actions",
      cell: () => (
        <DropdownMenu>
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
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Make a copy</DropdownMenuItem>
            <DropdownMenuItem>Favorite</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const userColumns: ColumnDef<z.infer<typeof AdminUserSchema.User>>[] = [
    {
      id: "drag",
      header: () => null,
      cell: ({ row }) => <DragHandle id={row.original.user_id} />,
    },
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "user_codename",
      header: "User",
      cell: ({ row }) => {
        return <TableCellViewer item={row.original} />
      },
      enableHiding: false,
    },
    {
      accessorKey: "user_lvl",
      header: "User Level",
      cell: ({ row }) => {

        const publishMutation = useMutation({
          mutationFn: () => new Promise(res => res("Hello")),
          onSuccess: () => {
            toast.success("Successful!", {description: "Suc"});
          }
        })

        return (
          <>
            <Select onValueChange={(value: string) => publishMutation.mutate()} defaultValue={String(row.original.user_lvl)}>
              <SelectTrigger
                className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                size="sm"
                id={`${row.original.user_lvl}-reviewer`}
              >
                <SelectValue placeholder="Select User Level" />
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
      },
    },
    {
      id: "actions",
      cell: () => (
        <DropdownMenu>
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
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Make a copy</DropdownMenuItem>
            <DropdownMenuItem>Favorite</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return {
    userColumns,
    recipeColumns,
    blogColumns
  }
}

