import { configureStore } from "@reduxjs/toolkit"

/* reducers */
import flowdata from "@/store/reducers/flow-data-slice"

export const store = configureStore({
  reducer: {
    flowdata
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch