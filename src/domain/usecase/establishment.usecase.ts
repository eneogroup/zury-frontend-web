import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { establishmentRepository } from '../../infrastructure/repositories/establishment.repository'

// ─── Thunks ────────────────────────────────────────────────────────────────────

export const getAllEstablishments = createAsyncThunk(
  'establishment/getAll',
  async (params: any, { rejectWithValue }) => {
    try {
      return await establishmentRepository.getAll(params)
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const getFeaturedEstablishments = createAsyncThunk(
  'establishment/getFeatured',
  async (_, { rejectWithValue }) => {
    try {
      return await establishmentRepository.getFeatured()
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const getRecentEstablishments = createAsyncThunk(
  'establishment/getRecent',
  async (_, { rejectWithValue }) => {
    try {
      return await establishmentRepository.getRecent()
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const getEstablishmentById = createAsyncThunk(
  'establishment/getById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await establishmentRepository.getById(id)
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const getSimilarEstablishments = createAsyncThunk(
  'establishment/getSimilar',
  async (id: string, { rejectWithValue }) => {
    try {
      return await establishmentRepository.getSimilar(id)
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

// ─── Slice ─────────────────────────────────────────────────────────────────────

interface EstablishmentState {
  establishments: any[]
  featuredEstablishments: any[]
  recentEstablishments: any[]
  currentEstablishment: any | null
  similarEstablishments: any[]
  status: 'idle' | 'loading' | 'success' | 'error'
  featuredStatus: 'idle' | 'loading' | 'success' | 'error'
  recentStatus: 'idle' | 'loading' | 'success' | 'error'
  detailStatus: 'idle' | 'loading' | 'success' | 'error'
  totalCount: number
  totalPages: number
}

const initialState: EstablishmentState = {
  establishments: [],
  featuredEstablishments: [],
  recentEstablishments: [],
  currentEstablishment: null,
  similarEstablishments: [],
  status: 'idle',
  featuredStatus: 'idle',
  recentStatus: 'idle',
  detailStatus: 'idle',
  totalCount: 0,
  totalPages: 0,
}

export const establishmentSlice = createSlice({
  name: 'establishment',
  initialState,
  reducers: {
    clearCurrentEstablishment: (state) => {
      state.currentEstablishment = null
      state.detailStatus = 'idle'
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllEstablishments.pending, (state) => { state.status = 'loading' })
      .addCase(getAllEstablishments.fulfilled, (state, { payload }) => {
        state.establishments = payload.establishments
        state.totalCount = payload.totalCount
        state.totalPages = payload.totalPages
        state.status = 'success'
      })
      .addCase(getAllEstablishments.rejected, (state) => { state.status = 'error' })

      .addCase(getFeaturedEstablishments.pending, (state) => { state.featuredStatus = 'loading' })
      .addCase(getFeaturedEstablishments.fulfilled, (state, { payload }) => {
        state.featuredEstablishments = payload.establishments
        state.featuredStatus = 'success'
      })
      .addCase(getFeaturedEstablishments.rejected, (state) => { state.featuredStatus = 'error' })

      .addCase(getRecentEstablishments.pending, (state) => { state.recentStatus = 'loading' })
      .addCase(getRecentEstablishments.fulfilled, (state, { payload }) => {
        state.recentEstablishments = payload.establishments
        state.recentStatus = 'success'
      })
      .addCase(getRecentEstablishments.rejected, (state) => { state.recentStatus = 'error' })

      .addCase(getEstablishmentById.pending, (state) => { state.detailStatus = 'loading' })
      .addCase(getEstablishmentById.fulfilled, (state, { payload }) => {
        state.currentEstablishment = payload.establishment
        state.detailStatus = 'success'
      })
      .addCase(getEstablishmentById.rejected, (state) => { state.detailStatus = 'error' })

      .addCase(getSimilarEstablishments.fulfilled, (state, { payload }) => {
        state.similarEstablishments = payload.establishments
      })
  },
})

export const { clearCurrentEstablishment } = establishmentSlice.actions
