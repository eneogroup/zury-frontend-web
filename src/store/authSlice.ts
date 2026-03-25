import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  isAuthenticated: boolean
  token: string | null
  user: {
    id?: string
    username?: string
    email?: string
    firstName?: string
    lastName?: string
    roles?: string[]
  } | null
  isInitialized: boolean
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
  isInitialized: false,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ token: string | null; user: AuthState['user'] }>) => {
      state.isAuthenticated = !!action.payload.token
      state.token = action.payload.token
      state.user = action.payload.user
    },
    logoutLocally: (state) => {
      state.isAuthenticated = false
      state.token = null
      state.user = null
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload
    },
  },
})

export const { setAuth, logoutLocally, setInitialized } = authSlice.actions
export default authSlice.reducer
