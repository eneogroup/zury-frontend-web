import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { categoryRepository, statsRepository } from '../../infrastructure/repositories/category.repository'

export const getCategories = createAsyncThunk(
  'category/getAll',
  async (_, { rejectWithValue }) => {
    try {
      return await categoryRepository.getAll()
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const getQuartiers = createAsyncThunk(
  'category/getQuartiers',
  async (ville_id: string | undefined, { rejectWithValue }) => {
    try {
      return await categoryRepository.getQuartiers(ville_id)
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const getGlobalStats = createAsyncThunk(
  'category/getStats',
  async (_, { rejectWithValue }) => {
    try {
      return await statsRepository.getGlobalStats()
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

interface CategoryState {
  categories: any[]
  quartiers: any[]
  stats: any | null
  status: 'idle' | 'loading' | 'success' | 'error'
  statsStatus: 'idle' | 'loading' | 'success' | 'error'
}

const initialState: CategoryState = {
  categories: [],
  quartiers: [],
  stats: null,
  status: 'idle',
  statsStatus: 'idle',
}

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getCategories.pending, (state) => { state.status = 'loading' })
      .addCase(getCategories.fulfilled, (state, { payload }) => {
        state.categories = payload.categories
        state.status = 'success'
      })
      .addCase(getCategories.rejected, (state) => { state.status = 'error' })

      .addCase(getQuartiers.fulfilled, (state, { payload }) => {
        state.quartiers = payload.quartiers
      })

      .addCase(getGlobalStats.pending, (state) => { state.statsStatus = 'loading' })
      .addCase(getGlobalStats.fulfilled, (state, { payload }) => {
        state.stats = payload.stats
        state.statsStatus = 'success'
      })
      .addCase(getGlobalStats.rejected, (state) => { state.statsStatus = 'error' })
  },
})
