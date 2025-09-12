import InputField from "@/components/Input";
import Error from "@/components/Error";
import React, {useEffect} from "react";
import CreateEditorLexicalComposer
  from "@/app/(protected-user)/columns/create/components/create-editor-lexical-composer";
import {Controller, FieldValues, useForm} from "react-hook-form";
import z from "zod";
import {GetBlogImagesSchema, PostBlogSchema} from "@/types/blog-types";
import {zodResolver} from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store/store";
import CreateEditorFileUpload from "@/app/(protected-user)/columns/create/components/create-editor-file-upload";
import {
  setTotalBlogImages,
  setUploadedImages
} from "@/app/(protected-user)/columns/create/components/create-editor-slice";

type CreateEditorWrapperProps = {
  blog_images: z.infer<typeof GetBlogImagesSchema.GetBlogImages>;
}

export const content = '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

export default function CreateEditor({blog_images}: CreateEditorWrapperProps) {

  const dispatch = useDispatch();


  const {register, control, setValue, handleSubmit, formState: {errors}} = useForm<z.infer<typeof PostBlogSchema.PostBlog>>({
    mode: 'onBlur',
    resolver: zodResolver(PostBlogSchema.PostBlog)
  });

  const editorState = useSelector((state: RootState) => state.editorState);

  const onSubmit = (data: FieldValues) => console.log(data);
  useEffect(() => {
    setValue("editor_state", editorState.editorState);
    console.log(editorState.editorState);
    console.log(editorState.editorState === content);
  }, [editorState.editorState]);

  useEffect(() => {
    dispatch(setUploadedImages(blog_images.blog_images));
    dispatch(setTotalBlogImages(blog_images.total_blog_images));
  }, [blog_images.blog_images]);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
      {Object.keys(errors).map((err, idx) => {
        return idx < 1 ? <Error key={idx}>{errors[err as keyof typeof errors]?.message}</Error> : undefined
      })}
      <label htmlFor="">
        <InputField
          {...register("title")}
          className={`py-2 px-4 w-full border border-primary-text rounded-md text-xs md:text-sm bg-secondary-bg`}
          placeholder="キーワードでレシピを検索"
          type="text"
        />
      </label>
      <div className="flex gap-4">
        <Controller render={({field}) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger id={"user_gender"} className="min-w-32 bg-secondary-bg border border-primary-text">
              <SelectValue placeholder="性別を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>性別を選択</SelectLabel>
                <SelectItem value="レシピ特集">レシピ特集</SelectItem>
                <SelectItem value="基礎知識">基礎知識</SelectItem>
                <SelectItem value="その他">その他</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
          name={"category"}
          control={control}
        />
        <CreateEditorFileUpload control={control} />
      </div>
      <CreateEditorLexicalComposer />
    </form>
  )
}