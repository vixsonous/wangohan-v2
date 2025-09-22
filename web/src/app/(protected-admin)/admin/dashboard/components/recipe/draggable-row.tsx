"use client";

import {flexRender, Row} from "@tanstack/react-table";
import {useSortable} from "@dnd-kit/sortable";
import {TableCell, TableRow} from "@/components/ui/table";
import { CSS } from "@dnd-kit/utilities";
import {isBlog, isRecipe, isUser} from "@/app/(protected-admin)/admin/dashboard/components/recipe/generic-data-table";
import {memo} from "react";

export default memo(function DraggableRow<T>({ row }: { row: Row<T> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: isRecipe(row.original) ? row.original.recipe_id : isBlog(row.original) ? row.original.blog_id : isUser(row.original) ? row.original.user_id : -1,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
});