import { configureStore } from "@reduxjs/toolkit"

/* reducers */
import flowData from "@/store/reducers/flow-data-slice"
import flowNodes from "@/store/reducers/nodes-list-slice";

export const store = configureStore({
  reducer: {
    flowData,
    flowNodes,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch