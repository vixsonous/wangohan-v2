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

export default memo(function Editor({ userId, blogData }: { userId: number, blogData?: z.infer<typeof BlogSchema.Blog> }) {
  const helper = useEditorHelper();
  const states = useEditorStates();

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

  const formOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const t = e.currentTarget;
    const name = t.name;

    states.setForm((prev) => ({ ...prev, [name]: t.value }));
  };

  return (
    <h1>Editor</h1>
    // states.isMounted && (
    //   <React.Fragment>
    //     <section className="mt-6">
    //       <Label htmlFor="blog_title" label="Title:">
    //         <React.Fragment>
    //           <input
    //             value={states.form.blog_title}
    //             type="text"
    //             className="py-1 px-4 focus:outline-primary-text rounded-md"
    //             name="blog_title"
    //             id="blog_title"
    //             onChange={formOnChange}
    //             onFocus={() => states.setTitleFocus(true)}
    //             onBlur={() => states.setTitleFocus(false)}
    //           />
    //           <ErrorSpan>{states.formErrors.blog_title}</ErrorSpan>
    //         </React.Fragment>
    //       </Label>
    //       <div className="flex gap-4">
    //         <Label htmlFor="blog-category" label="Category:">
    //           <select
    //             value={states.form.blog_category}
    //             className="py-2 px-4 rounded-md"
    //             name="blog_category"
    //             id="blog_category"
    //             onChange={formOnChange}
    //           >
    //             <option value="レシピ特集">レシピ特集</option>
    //             <option value="基礎知識">基礎知識</option>
    //             <option value="その他">その他</option>
    //           </select>
    //         </Label>
    //         <Label htmlFor="blog_image" label="Thumbnail:">
    //           <React.Fragment>
    //             <GeneralButton
    //               onClick={() => {
    //                 customDispatch.displayModal(modalIds.editorModal);
    //                 states.setModalMode("image-upload");
    //                 states.setImageListPage(0);
    //               }}
    //             >
    //               {states.form.filename}
    //             </GeneralButton>
    //             <ErrorSpan>{states.formErrors.file}</ErrorSpan>
    //           </React.Fragment>
    //         </Label>
    //       </div>
    //       <EditorLexicalComposer
    //         states={states}
    //         helper={helper}
    //         userId={userId}
    //         isEdit={blogData !== undefined}
    //         blogId={blogData !== undefined ? blogData.blog_id : undefined}
    //       />
    //     </section>
    //     <Modal modalIdProps={modalIds.editorModal}>
    //       {states.modalMode === "image-upload" ? (
    //         <ImageUploadSelection
    //           states={states}
    //           helper={helper}
    //           dispatch={customDispatch}
    //         />
    //       ) : (
    //         <FetchedImageList
    //           states={states}
    //           helper={helper}
    //           dispatch={customDispatch}
    //         />
    //       )}
    //     </Modal>
    //   </React.Fragment>
    // )
  );
});
