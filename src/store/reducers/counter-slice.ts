import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type IninitialState = {
  value: number;
}

const initialState: IninitialState = {
  value: 0,
}

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByVal: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    }
  }
})

export const { decrement, increment, incrementByVal } = counterSlice.actions;
export default counterSlice.reducer;