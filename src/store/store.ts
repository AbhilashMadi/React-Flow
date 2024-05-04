import { configureStore } from "@reduxjs/toolkit"

/* reducers */
import counter from "@/store/reducers/counter-slice"

export const store = configureStore({
  reducer: {
    counter
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch