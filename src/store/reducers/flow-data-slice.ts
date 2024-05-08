import { createSlice } from "@reduxjs/toolkit";
import type { ParseResult } from "papaparse";

type IninitialState = {
  filedata: ParseResult<object> & {
    filename: string;
  };
  currentlist: object[];
}

const initialState: IninitialState = {
  filedata: {
    filename: "",
    data: [],
    errors: [],
    meta: {},
  } as unknown as ParseResult<object> & {
    filename: string;
  },
  currentlist: []
}

const counterSlice = createSlice({
  name: "fileData",
  initialState,
  reducers: {
    updateFlowData: (state, action) => ({ ...state, filedata: action.payload, currentlist: action.payload }),
    updateCurrentList: (state, action) => ({ ...state, currentlist: action.payload }),
  }
})

export const { updateFlowData, updateCurrentList } = counterSlice.actions;
export default counterSlice.reducer;