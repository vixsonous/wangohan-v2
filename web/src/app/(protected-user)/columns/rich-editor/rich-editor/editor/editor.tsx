import InputField from "@/components/Input";
import Error from "@/components/Error";
import React, {useEffect} from "react";
import EditorLexicalComposer
  from "@/app/(protected-user)/columns/rich-editor/rich-editor/editor/editor-lexical-composer";
import {Controller, useForm} from "react-hook-form";
import z from "zod";
import {BlogSchema, GetBlogImagesSchema, PostBlogSchema} from "@/types/blog-types";
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
import EditorFileUpload from "@/app/(protected-user)/columns/rich-editor/rich-editor/editor/editor-file-upload";
import {
  setTotalBlogImages,
  setUploadedImages
} from "@/app/(protected-user)/columns/rich-editor/rich-editor/editor/editor-slice";
import {UserSchema} from "@/types/user-types.user";
import {setUser} from "@/store/slice/user-slice";

type CreateEditorWrapperProps = {
  blog_images: z.infer<typeof GetBlogImagesSchema.GetBlogImages>;
  user_data: z.infer<typeof UserSchema.User>;
  blog?: z.infer<typeof BlogSchema.Blog> | undefined;
}

export const content = '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

export default function Editor({blog_images, user_data, blog}: CreateEditorWrapperProps) {

  const dispatch = useDispatch();

  const {register, control, setValue, handleSubmit, formState: {errors}} = useForm<z.infer<typeof PostBlogSchema.PostBlog>>({
    mode: 'onBlur',
    resolver: zodResolver(PostBlogSchema.PostBlog),
    defaultValues: blog ? {
      blog_id: blog.blog_id,
      title: blog.title,
      editor_state: blog.editor_state,
      category: blog.blog_category,
      file: blog.blog_image,
      is_published: blog.is_published
    } : undefined
  });

  const editorState = useSelector((state: RootState) => state.editorState);

  useEffect(() => {
    setValue("editor_state", editorState.editorState);
  }, [editorState.editorState]);

  useEffect(() => {
    dispatch(setUploadedImages(blog_images.blog_images));
    dispatch(setTotalBlogImages(blog_images.total_blog_images));
  }, [blog_images.blog_images]);

  useEffect(() => {
    dispatch(setUser(user_data));
  }, [user_data]);
  return (
    <form className="mt-6">
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
        <EditorFileUpload control={control} />
      </div>
      <EditorLexicalComposer handleSubmit={handleSubmit} blog={blog} />
    </form>
  )
}