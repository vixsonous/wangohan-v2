"use client"

import * as React from "react"
import { z } from "zod"
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
  Recipe, User
} from "@/app/(protected-admin)/admin/dashboard/components/generic-data-table";
import {AdminRecipeSchema} from "@/types/recipe-types";
import { useColumns } from "@/app/(protected-admin)/admin/dashboard/components/columns";
import GenericDataTable from "@/app/(protected-admin)/admin/dashboard/components/generic-data-table";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "@/lib/tanstack-query";
import {AdminBlogSchema} from "@/types/blog-types";
import {AdminUserSchema} from "@/types/user-types.user";
import {useEffect, useState} from "react";
import {Provider, useDispatch, useSelector} from "react-redux";
import {RootState, store} from "@/store/store";
import {setRecipes} from "@/app/(protected-admin)/admin/dashboard/components/recipe/recipe-slice";
import {setBlogs} from "@/app/(protected-admin)/admin/dashboard/components/blog/blog-slice";
import {setUsers} from "@/app/(protected-admin)/admin/dashboard/components/user/user-slice";

type DataTableProps = {
  recipes: z.infer<typeof AdminRecipeSchema.Recipe>[],
  blogs: z.infer<typeof AdminBlogSchema.Blog>[],
  users: z.infer<typeof AdminUserSchema.User>[]
};

function DataTableCore({
  recipes,
  blogs,
  users,
}: DataTableProps ) {

  const dispatch = useDispatch();
  const [init, setInit] = useState(() => false);
  const recipeAdmin = useSelector((state: RootState) => state.recipeAdmin);
  const blogsAdmin = useSelector((state: RootState) => state.blogsAdmin);
  const usersAdmin = useSelector((state: RootState) => state.usersAdmin);

  const {recipeColumns, userColumns, blogColumns} = useColumns();

  useEffect(() => {
    if(recipes && recipes.length !== 0) {
      dispatch(setRecipes(recipes));
    }

    if(blogs && blogs.length !== 0) {
      dispatch(setBlogs(blogs));
    }

    if(users && users.length !== 0) {
      dispatch(setUsers(users));
    }

    setInit(true);
  }, [recipes, blogs, users, dispatch]);

  return init && (
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
            <SelectItem value="users">Users</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="recipes">Recipes</TabsTrigger>
          <TabsTrigger value="blogs">
            Blogs
          </TabsTrigger>
          <TabsTrigger value="users">
            Users
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent
        value="recipes"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6 data-[state=inactive]:hidden"
        forceMount={true}
      >
        <GenericDataTable<Recipe> initialData={recipeAdmin} columns={recipeColumns} />
      </TabsContent>
      <TabsContent
        value="blogs"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6 data-[state=inactive]:hidden"
        forceMount={true}
      >
        <GenericDataTable<Blog> initialData={blogsAdmin} columns={blogColumns} />
      </TabsContent>
      <TabsContent
        value="users"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6 data-[state=inactive]:hidden"
        forceMount={true}
      >
        <GenericDataTable<User> initialData={usersAdmin} columns={userColumns} />
      </TabsContent>
    </Tabs>
  )
}

export default function DataTable({recipes, blogs, users} : DataTableProps) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <DataTableCore recipes={recipes} blogs={blogs} users={users} />
      </QueryClientProvider>
    </Provider>
  )
}

