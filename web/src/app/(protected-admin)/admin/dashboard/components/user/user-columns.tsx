import {ColumnDef} from "@tanstack/react-table";
import z from "zod";
import {AdminUserSchema} from "@/types/user-types.user";
import {Checkbox} from "@/components/ui/checkbox";
import TableCellViewer from "@/app/(protected-admin)/admin/dashboard/components/table-cell-viewer";
import * as React from "react";
import {DragHandle} from "@/app/(protected-admin)/admin/dashboard/components/drag-handle";
import {UserActions, UserLevel} from "@/app/(protected-admin)/admin/dashboard/components/user/user-column-components";
import {
  DeleteMutationType, DispatchType,
  UpdateUserLevelMutationType
} from "@/app/(protected-admin)/admin/dashboard/components/columns";

export const useUserColumns = (
  updateUserLevelMutation: UpdateUserLevelMutationType,
  deleteMutation: DeleteMutationType,
  dispatch: DispatchType
) => {
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
      cell: ({ row }) =>
        <UserLevel
          user_id={row.original.user_id}
          user_lvl={row.original.user_lvl}
          user_codename={row.original.user_codename}
          updateUserLevelMutation={updateUserLevelMutation}
          dispatch={dispatch}
        />,
    },
    {
      id: "actions",
      cell: ({row}) =>
        <UserActions
          user_id={row.original.user_id}
          user_codename={row.original.user_codename}
          deleteMutation={deleteMutation}
          dispatch={dispatch}
        />,
    },
  ]

  return userColumns;
}