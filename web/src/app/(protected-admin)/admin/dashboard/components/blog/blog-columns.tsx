import {ColumnDef} from "@tanstack/react-table";
import z from "zod";
import {AdminBlogSchema} from "@/types/blog-types";
import {Checkbox} from "@/components/ui/checkbox";
import TableCellViewer from "@/app/(protected-admin)/admin/dashboard/components/table-cell-viewer";
import {BlogActions, BlogPublish} from "@/app/(protected-admin)/admin/dashboard/components/blog/blog-column-components";
import * as React from "react";
import {DragHandle} from "@/app/(protected-admin)/admin/dashboard/components/drag-handle";
import {
  DeleteMutationType,
  DispatchType,
  PublishMutationType
} from "@/app/(protected-admin)/admin/dashboard/components/columns";

export const useBlogColumns = (
  publishMutation: PublishMutationType,
  deleteMutation: DeleteMutationType,
  dispatch: DispatchType
) => {
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
      cell: ({ row }) =>
        <BlogPublish
          blog_id={row.original.blog_id}
          is_published={row.original.is_published}
          publishMutation={publishMutation}
          dispatch={dispatch}
        />
    },
    {
      id: "actions",
      cell: ({row}) =>
        <BlogActions
          blog_id={row.original.blog_id}
          title={row.original.title}
          deleteMutation={deleteMutation}
          dispatch={dispatch}
        />,
    },
  ]

  return blogColumns;
}