import { configureStore } from '@reduxjs/toolkit'
import snippetReducer  from './redux/snippetSlice.js'
export const store = configureStore({
  reducer: {
    snippet: snippetReducer,
   },
})
