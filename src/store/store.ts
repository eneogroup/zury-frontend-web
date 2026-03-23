import { configureStore } from '@reduxjs/toolkit'
import { establishmentSlice } from '../domain/usecase/establishment.usecase'
import { eventSlice } from '../domain/usecase/event.usecase'
import { categorySlice } from '../domain/usecase/category.usecase'
import { apiSlice } from './apiSlice'
import authReducer from './authSlice'

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    establishment: establishmentSlice.reducer,
    event: eventSlice.reducer,
    category: categorySlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
