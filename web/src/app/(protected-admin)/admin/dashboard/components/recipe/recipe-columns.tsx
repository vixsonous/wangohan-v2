import {ColumnDef} from "@tanstack/react-table";
import z from "zod";
import {AdminRecipeSchema} from "@/types/recipe-types";
import {Checkbox} from "@/components/ui/checkbox";
import RecipeCellViewer from "@/app/(protected-admin)/admin/dashboard/components/recipe-cell-viewer";
import {Badge} from "@/components/ui/badge";
import {
  RecipeActions,
  RecipePublish
} from "@/app/(protected-admin)/admin/dashboard/components/recipe/recipe-column-components";
import Link from "next/link";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {ENDPOINTS} from "@/constants/endpoints";
import * as React from "react";
import {DragHandle} from "@/app/(protected-admin)/admin/dashboard/components/drag-handle";
import {
  DeleteMutationType,
  DispatchType,
  PublishMutationType
} from "@/app/(protected-admin)/admin/dashboard/components/columns";

export const useRecipeColumns = (
  deleteMutation: DeleteMutationType,
  publishMutation: PublishMutationType,
  dispatch: DispatchType
) => {
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
        return <RecipeCellViewer deleteMutation={deleteMutation} item={row.original} />
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
        return <RecipePublish recipe_id={row.original.recipe_id} is_published={row.original.is_published} publishMutation={publishMutation} dispatch={dispatch} />
      },
    },
    {
      accessorKey: "user",
      header: () => <div className="w-full text-left">User</div>,
      cell: ({ row }) => (
        row.original.user ? (
          <Link href={`/user/${row.original.user?.user_id}/${row.original.user?.user_codename}`} className={"w-full flex justify-start gap-2"}>
            <Avatar>
              <AvatarImage src={`${process.env.NEXT_PUBLIC_ORIGIN}/api${ENDPOINTS.IMAGE}/transform?src=${(row.original.user && row.original.user.user_image)}&w=32&h=32`} />
            </Avatar>
            <Badge variant="outline" className="text-muted-foreground px-1.5">
              {row.original.user && row.original.user.user_codename}
            </Badge>
          </Link>
        ) : (
          <Badge variant={"outline"} className="text-muted-foreground px-1.5">
            匿名
          </Badge>
        )
      ),
    },
    {
      id: "actions",
      cell: ({row}) =>
        <RecipeActions
          recipe_id={row.original.recipe_id}
          recipe_name={row.original.recipe_name}
          deleteMutation={deleteMutation}
          dispatch={dispatch}
        />
    },
  ]

  return recipeColumns;
}