import { configureStore } from '@reduxjs/toolkit'
import { establishmentSlice } from '../domain/usecase/establishment.usecase'
import { eventSlice } from '../domain/usecase/event.usecase'
import { categorySlice } from '../domain/usecase/category.usecase'

export const store = configureStore({
  reducer: {
    establishment: establishmentSlice.reducer,
    event: eventSlice.reducer,
    category: categorySlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
