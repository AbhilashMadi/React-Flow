import { createSlice } from "@reduxjs/toolkit";
import type { ParseResult } from "papaparse";

type IninitialState = {
  filedata: ParseResult<object>;
}

const initialState: IninitialState = {
  filedata: {
    data: [],
    errors: [],
    meta: {},
  } as unknown as ParseResult<object>,
}

const counterSlice = createSlice({
  name: "fileData",
  initialState,
  reducers: {
    updateFlowData: (state, action) => ({ ...state, filedata: action.payload }),
  }
})

export const { updateFlowData } = counterSlice.actions;
export default counterSlice.reducer;