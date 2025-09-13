import {createSlice} from "@reduxjs/toolkit";
import z from "zod";
import {BlogImageSchema} from "@/types/blog-types";
import {content} from "@/app/(protected-user)/columns/create/components/create-editor";
import {LexicalEditor} from "lexical";
import {ListNodeTagType} from "@lexical/list";

type SetEditorStateAction = {
  payload: string;
  type: string;
}

type SetHTMLStringAction = {
  payload: string;
  type: string;
}

type SetUploadedImagesAction = {
  payload: z.infer<typeof BlogImageSchema.BlogImages>;
  type: string;
}

type SetTotalBlogImagesAction = {
  payload: number,
  type: string;
}

type SetTextFormatsAction = {
  payload: {
    field: "bold" |  "italic" | "underline" | "strikethrough" | "subscript" | "superscript" | "code" | "link";
    value: boolean;
  };
  type: string;
}

type SetToolbarActionsAction = {
  payload: {
    field: "redo" | "undo",
    value: boolean;
  },
  type: string;
}

type SetColorsAction = {
  payload: {
    field: "font" | "background";
    value: string;
  },
  type: string;
}

type SetBlockTypeAction = {
  payload: ListNodeTagType | string;
  type: string;
}

type SetSelectedElementKeyAction = {
  payload: string;
  type: string;
}

type SetCodeLanguageAction = {
  payload: string | undefined | null;
  type: string;
}

type SetFontFamilyAction = {
  payload: "sans-serif" | "sans" | "mitimasu";
  type: string;
}

type SetFontSizeAction = {
  payload: string,
  type: string;
}

export const createEditorSlice = createSlice({
  name: 'Create Editor State',
  initialState: {
    editorState: content,
    htmlString: "",
    uploadedImages: [] as z.infer<typeof BlogImageSchema.BlogImages>,
    total_blog_images: 0,
    font: {
      family: "mitimasu" as "sans-serif" | "sans" | "mitimasu",
      size: "15",
    },
    toolbar_actions: {
      undo: false,
      redo: false,
    },
    code_language: "" as string | undefined | null,
    selected_element_key: "",
    colors: {
      font: "#523636",
      background: "#FFE9C9",
    },
    block_type: "paragraph",
    text_formats: {
      bold: false,
      italic: false,
      underline: false,
      strikethrough: false,
      subscript: false,
      superscript: false,
      code: false,
      link: false,
    }
  },
  reducers: {
    setFontSize: (state, action: SetFontSizeAction) => {
      console.log("set size!" + action.payload);
      state.font.size = action.payload;
      return state;
    },
    setFontFamily: (state, action: SetFontFamilyAction) => {
      state.font.family = action.payload;
      return state;
    },
    setCodeLanguage: (state, action: SetCodeLanguageAction) => {
      state.code_language = action.payload;
      return state;
    },
    setSelectedElementKey: (state, action: SetSelectedElementKeyAction) => {
      state.selected_element_key = action.payload;
      return state;
    },
    setBlockType: (state, action: SetBlockTypeAction) => {
      state.block_type = action.payload;
      return state;
    },
    setColors: (state, action: SetColorsAction) => {
      state.colors[action.payload.field] = action.payload.value;
      return state;
    },
    setToolbarActions: (state, action: SetToolbarActionsAction) => {
      state.toolbar_actions[action.payload.field] = action.payload.value;
      return state;
    },
    setTextFormats: (state, action: SetTextFormatsAction) => {
      state.text_formats[action.payload.field] = action.payload.value;
      return state;
    },
    setEditorState(state, action: SetEditorStateAction) {
      state.editorState = action.payload;
      return state;
    },
    setHTMLString(state, action: SetHTMLStringAction) {
      state.htmlString = action.payload;
      return state;
    },

    setUploadedImages(state, action: SetUploadedImagesAction) {
      state.uploadedImages = action.payload;
      return state;
    },

    addUploadedImages(state, action: SetUploadedImagesAction) {
      state.uploadedImages = state.uploadedImages.concat(action.payload);
      return state;
    },

    setTotalBlogImages(state, action: SetTotalBlogImagesAction) {
      state.total_blog_images = action.payload;
      return state;
    }
  }
});

export const {
  setFontSize,
  setFontFamily,
  setCodeLanguage,
  setSelectedElementKey,
  setBlockType,
  setEditorState,
  setHTMLString,
  setUploadedImages,
  setTotalBlogImages,
  addUploadedImages,
  setTextFormats,
  setToolbarActions,
  setColors
} = createEditorSlice.actions;
export default createEditorSlice.reducer;