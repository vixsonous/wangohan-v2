"use client"

import * as React from "react"
import { z } from "zod"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Blog,
  Recipe
} from "@/app/(protected-admin)/admin/dashboard/components/recipe/generic-data-table";
import {AdminRecipeSchema} from "@/types/recipe-types";
import {blogColumns, recipeColumns} from "@/app/(protected-admin)/admin/dashboard/components/recipe/columns";
import GenericDataTable from "@/app/(protected-admin)/admin/dashboard/components/recipe/generic-data-table";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "@/lib/tanstack-query";

export function DataTable({
  recipes
}: {
  recipes: z.infer<typeof AdminRecipeSchema.Recipe>[]
}) {

  return (
    <QueryClientProvider client={queryClient}>
      <Tabs
        defaultValue="recipes"
        className="w-full flex-col justify-start gap-6"
      >
        <div className="flex items-center justify-between px-4 lg:px-6">
          <Label htmlFor="view-selector" className="sr-only">
            View
          </Label>
          <Select defaultValue="recipes">
            <SelectTrigger
              className="flex w-fit @4xl/main:hidden"
              size="sm"
              id="view-selector"
            >
              <SelectValue placeholder="Select a view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recipes">Recipes</SelectItem>
              <SelectItem value="blogs">Blogs</SelectItem>
              <SelectItem value="key-personnel">Key Personnel</SelectItem>
              <SelectItem value="focus-documents">Focus Documents</SelectItem>
            </SelectContent>
          </Select>
          <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
            <TabsTrigger value="recipes">Recipes</TabsTrigger>
            <TabsTrigger value="blogs">
              Blogs
            </TabsTrigger>
            <TabsTrigger value="key-personnel">
              Key Personnel <Badge variant="secondary">2</Badge>
            </TabsTrigger>
            <TabsTrigger value="focus-documents">Focus Documents</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent
          value="recipes"
          className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6 data-[state=inactive]:hidden"
          forceMount={true}
        >
          <GenericDataTable<Recipe> initialData={recipes} columns={recipeColumns} />
        </TabsContent>
        <TabsContent
          value="blogs"
          className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6 data-[state=inactive]:hidden"
          forceMount={true}
        >
          <GenericDataTable<Blog> initialData={[]} columns={blogColumns} />
        </TabsContent>
        <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
          <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
        </TabsContent>
        <TabsContent
          value="focus-documents"
          className="flex flex-col px-4 lg:px-6"
        >
          <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
        </TabsContent>
      </Tabs>
    </QueryClientProvider>
  )
}
