"use client";

import dynamic from "next/dynamic";
import {Provider} from "react-redux";
import {store} from "@/store/store";

const CreateEditor = dynamic(() => import("./create-editor"), {ssr: false, loading: () => <span>Loading</span>});

export default function CreateEditorWrapper() {
  return (
    <Provider store={store}>
      <CreateEditor />
    </Provider>
  )
}