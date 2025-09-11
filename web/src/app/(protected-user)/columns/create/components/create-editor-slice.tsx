import {createSlice} from "@reduxjs/toolkit";

type SetEditorStateAction = {
  payload: string;
  type: string;
}

type SetHTMLStringAction = {
  payload: string;
  type: string;
}

export const createEditorSlice = createSlice({
  name: 'Create Editor State',
  initialState: {
    editorState: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
    htmlString: "",
  },
  reducers: {
    setEditorState(state, action: SetEditorStateAction) {
      state.editorState = action.payload;
      return state;
    },
    setHTMLString(state, action: SetHTMLStringAction) {
      state.htmlString = action.payload;
      return state;
    }
  }
});

export const {setEditorState, setHTMLString} = createEditorSlice.actions;
export default createEditorSlice.reducer;