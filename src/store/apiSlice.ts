import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from './store'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://zury-backend-production.up.railway.app'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      const token = (getState() as RootState).auth?.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    getEstablishments: builder.query<any, any>({
      query: (params) => ({ url: '/api/v1/etablissements/', params }),
    }),
    getFeaturedEstablishments: builder.query<any, void>({
      query: () => '/api/v1/etablissements/featured/',
    }),
    getRecentEstablishments: builder.query<any, void>({
      query: () => '/api/v1/etablissements/recents/',
    }),
    getEstablishmentById: builder.query<any, string>({
      query: (id) => `/api/v1/etablissements/${id}/`,
    }),
    getSimilarEstablishments: builder.query<any, string>({
      query: (id) => `/api/v1/etablissements/${id}/similaires/?limit=8`,
    }),
    searchGlobal: builder.query<any, any>({
      query: (params) => ({ url: '/api/v1/search/', params }),
    }),
    trackView: builder.mutation<void, any>({
      query: (payload) => ({
        url: '/api/v1/tracking/vue-etablissement/',
        method: 'POST',
        body: payload,
      }),
    }),
    getUserProfile: builder.query<any, void>({
      query: () => '/api/v1/me/',
    }),
    updateUserProfile: builder.mutation<any, any>({
      query: (payload) => ({
        url: '/api/v1/me/',
        method: 'PATCH',
        body: payload,
      }),
    }),
    getUserFavorites: builder.query<any, void>({
      query: () => '/api/v1/me/favorites/',
    }),
    toggleEstablishmentFavorite: builder.mutation<any, string>({
      query: (id) => ({
        url: `/api/v1/etablissements/${id}/favorite/`,
        method: 'POST',
      }),
    }),
    toggleEventFavorite: builder.mutation<any, string>({
      query: (id) => ({
        url: `/api/v1/events/${id}/favorite/`,
        method: 'POST',
      }),
    }),
    getUserHistory: builder.query<any, void>({
      query: () => '/api/v1/me/history/',
    }),
    addReview: builder.mutation<any, { id: string; note: number; commentaire: string }>({
      query: ({ id, ...body }) => ({
        url: `/api/v1/establishments/${id}/reviews/`,
        method: 'POST',
        body,
      }),
    }),
    deleteReview: builder.mutation<any, string>({
      query: (reviewId) => ({
        url: `/api/v1/reviews/${reviewId}/`,
        method: 'DELETE',
      }),
    }),
    bookEvent: builder.mutation<any, { eventId: string; nombre_places: number }>({
      query: ({ eventId, ...body }) => ({
        url: `/api/v1/events/${eventId}/book/`,
        method: 'POST',
        body,
      }),
    }),
    bookTable: builder.mutation<any, { estId: string; date: string; heure: string; nombre_personnes: number; notes: string }>({
      query: ({ estId, ...body }) => ({
        url: `/api/v1/establishments/${estId}/table-reservations/`,
        method: 'POST',
        body,
      }),
    }),
    getUserTableReservations: builder.query<any, void>({
      query: () => '/api/v1/me/table-reservations/',
    }),
    getUserEventBookings: builder.query<any, void>({
      query: () => '/api/v1/me/bookings/',
    }),
    createOrder: builder.mutation<any, { estId: string; items: any[]; total: number; adresse_livraison?: string }>({
      query: ({ estId, ...body }) => ({
        url: `/api/v1/establishments/${estId}/orders/`,
        method: 'POST',
        body,
      }),
    }),
    getOrderDetails: builder.query<any, string>({
      query: (orderId) => `/api/v1/orders/${orderId}/`,
    }),
    getUserOrders: builder.query<any, void>({
      query: () => '/api/v1/me/orders/',
    }),
    getMenus: builder.query<any, string>({
      query: (estId) => `/api/v1/establishments/${estId}/menus/`,
    }),
  }),
})

export const {
  useGetEstablishmentsQuery,
  useGetFeaturedEstablishmentsQuery,
  useGetRecentEstablishmentsQuery,
  useGetEstablishmentByIdQuery,
  useGetSimilarEstablishmentsQuery,
  useSearchGlobalQuery,
  useTrackViewMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetUserFavoritesQuery,
  useToggleEstablishmentFavoriteMutation,
  useToggleEventFavoriteMutation,
  useGetUserHistoryQuery,
  useAddReviewMutation,
  useDeleteReviewMutation,
  useBookEventMutation,
  useBookTableMutation,
  useGetUserTableReservationsQuery,
  useGetUserEventBookingsQuery,
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  useGetUserOrdersQuery,
  useGetMenusQuery,
} = apiSlice
