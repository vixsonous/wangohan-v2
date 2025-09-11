"use client";
import "./style.css";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";

import useEditorStates from "./editor-states";
import useEditorHelper from "./editor-helper";
import EditorLexicalComposer from "./editor-lexical-composer";
import FetchedImageList from "./fetched-image-list";
import ImageUploadSelection from "./image-upload-selection";
import z from "zod";
import {BlogSchema} from "@/types/blog-types";
import Button from "@/components/Button";
import Error from "@/components/Error";
import InputField from "@/components/Input";
import {useForm} from "react-hook-form";

export default memo(function Editor({ userId, blogData }: { userId: number, blogData?: z.infer<typeof BlogSchema.Blog> }) {
  const helper = useEditorHelper();
  const states = useEditorStates();

  const {register, } = useForm();


  useEffect(() => {
    const c = sessionStorage.getItem("editor");
    if (c) {
      states.setEditorState(c);
    }

    if(blogData) {
      states.setEditorState(JSON.stringify(blogData.editor_state));
      states.setForm(prev => ({
        ...prev,
        blog_category: blogData.blog_category,
        blog_title: blogData.title,
      }))
    }

    states.setIsMounted(true);
  }, []);

  return (
    <section className="mt-6">
      <label htmlFor="">
        <InputField
          className={`py-2 px-4 w-full border border-primary-text rounded-md text-xs md:text-sm bg-secondary-bg`}
          placeholder="キーワードでレシピを検索"
          type="text"
        />
        <Error>{states.formErrors.blog_title}</Error>
      </label>
      <div className="flex gap-4">
        <label htmlFor="">
          <select
            value={states.form.blog_category}
            className="py-2 px-4 rounded-md"
            name="blog_category"
            id="blog_category"
          >
            <option value="レシピ特集">レシピ特集</option>
            <option value="基礎知識">基礎知識</option>
            <option value="その他">その他</option>
          </select>
        </label>
        <label htmlFor="">
          <Button
            onClick={() => {
              // customDispatch.displayModal(modalIds.editorModal);
              states.setModalMode("image-upload");
              states.setImageListPage(0);
            }}
          >
            Filename
          </Button>
          <Error>{states.formErrors.file}</Error>
        </label>
      </div>
      <EditorLexicalComposer
        states={states}
        helper={helper}
        userId={userId}
        isEdit={false}
      />
    </section>
  );
});
