import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://zury-backend-production.up.railway.app'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
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
} = apiSlice
