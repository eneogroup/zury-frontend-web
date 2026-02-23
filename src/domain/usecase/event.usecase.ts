import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { eventRepository } from '../../infrastructure/repositories/event.repository'

export const getAllEvents = createAsyncThunk(
  'event/getAll',
  async (params: any, { rejectWithValue }) => {
    try {
      return await eventRepository.getAll(params)
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const getUpcomingEvents = createAsyncThunk(
  'event/getUpcoming',
  async (_, { rejectWithValue }) => {
    try {
      return await eventRepository.getUpcoming()
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const getTodayEvents = createAsyncThunk(
  'event/getToday',
  async (_, { rejectWithValue }) => {
    try {
      return await eventRepository.getToday()
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const getWeekendEvents = createAsyncThunk(
  'event/getWeekend',
  async (_, { rejectWithValue }) => {
    try {
      return await eventRepository.getThisWeekend()
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const getEventById = createAsyncThunk(
  'event/getById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await eventRepository.getById(id)
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

interface EventState {
  events: any[]
  upcomingEvents: any[]
  currentEvent: any | null
  status: 'idle' | 'loading' | 'success' | 'error'
  upcomingStatus: 'idle' | 'loading' | 'success' | 'error'
  detailStatus: 'idle' | 'loading' | 'success' | 'error'
  totalCount: number
  totalPages: number
}

const initialState: EventState = {
  events: [],
  upcomingEvents: [],
  currentEvent: null,
  status: 'idle',
  upcomingStatus: 'idle',
  detailStatus: 'idle',
  totalCount: 0,
  totalPages: 0,
}

export const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAllEvents.pending, (state) => { state.status = 'loading' })
      .addCase(getAllEvents.fulfilled, (state, { payload }) => {
        state.events = payload.events
        state.totalCount = payload.totalCount
        state.totalPages = payload.totalPages
        state.status = 'success'
      })
      .addCase(getAllEvents.rejected, (state) => { state.status = 'error' })

      .addCase(getUpcomingEvents.pending, (state) => { state.upcomingStatus = 'loading' })
      .addCase(getUpcomingEvents.fulfilled, (state, { payload }) => {
        state.upcomingEvents = payload.events
        state.upcomingStatus = 'success'
      })
      .addCase(getUpcomingEvents.rejected, (state) => { state.upcomingStatus = 'error' })

      .addCase(getTodayEvents.fulfilled, (state, { payload }) => {
        state.events = payload.events
        state.status = 'success'
      })
      .addCase(getWeekendEvents.fulfilled, (state, { payload }) => {
        state.events = payload.events
        state.status = 'success'
      })

      .addCase(getEventById.pending, (state) => { state.detailStatus = 'loading' })
      .addCase(getEventById.fulfilled, (state, { payload }) => {
        state.currentEvent = payload.event
        state.detailStatus = 'success'
      })
      .addCase(getEventById.rejected, (state) => { state.detailStatus = 'error' })
  },
})
