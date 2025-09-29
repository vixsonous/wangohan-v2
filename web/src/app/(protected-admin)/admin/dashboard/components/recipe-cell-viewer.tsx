"use client";

import {useIsMobile} from "@/hooks/use-mobile";
import {
  Drawer, DrawerClose,
  DrawerContent,
  DrawerDescription, DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart";
import {Area, AreaChart, CartesianGrid, XAxis} from "recharts";
import {Separator} from "@/components/ui/separator";
import {IconTrendingUp} from "@tabler/icons-react";
import * as React from "react";
import {
  Recipe
} from "@/app/(protected-admin)/admin/dashboard/components/generic-data-table";
import {memo} from "react";
import Image from "@/components/Image/client";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {ENDPOINTS} from "@/constants/endpoints";
import {DeleteMutationType, DispatchType} from "@/app/(protected-admin)/admin/dashboard/components/columns";
import StarReviews from "@/components/StarReviews";
import Button from "@/components/Button";
import {Button as ButtonUI} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {deleteComment} from "@/app/(protected-admin)/admin/dashboard/components/recipe/recipe-slice";
import {ScrollArea} from "@/components/ui/scroll-area";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export default memo(function RecipeCellViewer<T>({ item, deleteMutation, dispatch }: { item: Recipe, deleteMutation: DeleteMutationType, dispatch: DispatchType }) {
  const isMobile = useIsMobile();

  const title = item.recipe_name;

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <ButtonUI variant="link" className="text-foreground w-fit px-0 text-left">
          {title}
        </ButtonUI>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>
            Showing total visitors for the last 6 months
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {!isMobile && (
            <>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 0,
                    right: 10,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                    hide
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    dataKey="mobile"
                    type="natural"
                    fill="var(--color-mobile)"
                    fillOpacity={0.6}
                    stroke="var(--color-mobile)"
                    stackId="a"
                  />
                  <Area
                    dataKey="desktop"
                    type="natural"
                    fill="var(--color-desktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <div className="grid gap-2">
                <div className="flex gap-2 leading-none font-medium">
                  Trending up by 5.2% this month{" "}
                  <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">
                  Showing total visitors for the last 6 months. This is just
                  some random text to test the layout. It spans multiple lines
                  and should wrap around.
                </div>
              </div>
              <Separator />
            </>
          )}
          <section className={"max-h-1/2"}>
            <h1 className={"mb-4"}>Comments</h1>
            <ScrollArea className={"flex flex-col gap-2 max-h-full "}>
              {item.recipe_comments.length > 0 ? (
                item.recipe_comments.map( (comment, idx) => (
                  <form key={idx} action="" className={"mb-2"}>
                    <Badge variant={"outline"} className={"flex w-full flex-col gap-2 items-start justify-start"}>
                      <section className={"w-full flex items-center gap-2"}>
                        <Avatar>
                          <AvatarImage src={`${process.env.NEXT_PUBLIC_ORIGIN}/api${ENDPOINTS.IMAGE}/transform?src=${(comment.user && comment.user.user_image)}&w=32&h=32`} />
                        </Avatar>
                        {comment.user?.user_codename || "Anonymous"}
                        <StarReviews value={comment.recipe_comment_rating} />
                        <Button type={"button"} onClick={async () => {
                          await deleteMutation.mutateAsync({
                            id: comment.recipe_comment_id,
                            name: comment.recipe_comment_subtext,
                            type: "comments"
                          });

                          dispatch(deleteComment({
                            recipe_id: item.recipe_id,
                            recipe_comment_id: comment.recipe_comment_id,
                          }));
                        }} className={"ml-auto"}>
                          <Image width={15} height={15} noprocess src={"/icons/svg/primary-trash.svg"} alt="trash icon for deleting comments"/>
                        </Button>
                      </section>
                      <span>{comment.recipe_comment_subtext}</span>
                    </Badge>
                  </form>
                ))
              ) : (
                <h1>No comments!</h1>
              )}
            </ScrollArea>
          </section>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <ButtonUI variant="outline">Done</ButtonUI>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
});