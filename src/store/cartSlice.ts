import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  establishmentId: string
  establishmentName: string
}

interface CartState {
  items: CartItem[]
  establishmentId: string | null
  establishmentName: string | null
}

const initialState: CartState = {
  items: [],
  establishmentId: null,
  establishmentName: null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      // If adding from a different establishment, clear the cart first (standard behavior)
      if (state.establishmentId && state.establishmentId !== action.payload.establishmentId) {
        state.items = []
      }
      
      state.establishmentId = action.payload.establishmentId
      state.establishmentName = action.payload.establishmentName

      const existingItem = state.items.find(item => item.id === action.payload.id)
      if (existingItem) {
        existingItem.quantity += action.payload.quantity
      } else {
        state.items.push(action.payload)
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      if (state.items.length === 0) {
        state.establishmentId = null
        state.establishmentName = null
      }
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id)
      if (item) {
        item.quantity = action.payload.quantity
      }
      if (item?.quantity === 0) {
        state.items = state.items.filter(i => i.id !== action.payload.id)
      }
      if (state.items.length === 0) {
        state.establishmentId = null
        state.establishmentName = null
      }
    },
    clearCart: (state) => {
      state.items = []
      state.establishmentId = null
      state.establishmentName = null
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
