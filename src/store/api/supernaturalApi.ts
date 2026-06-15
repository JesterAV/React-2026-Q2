import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const cacheTTL = Number(import.meta.env.VITE_API_CACHE_TTL) || 60000;

export const supernaturalApi = createApi({
  reducerPath: 'supernaturalApi',
  tagTypes: ['AllCharacters', 'Character'],
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_API_URL || 'https://supernatural-api.onrender.com'
  }),
  keepUnusedDataFor: cacheTTL / 1000,
  endpoints: (builder) => ({
    getAllCharacters: builder.query({
      query: (page: number = 1) => {
        const size = Number(import.meta.env.VITE_DEFAULT_PAGE_SIZE) || 20;
        return `/characters?page=${page}&size=${size}`;
      },
      
      providesTags: ['AllCharacters']
    }),
    searchCharacters: builder.query({
      query: ({ query, page = 1 }: { query: string; page?: number }) => {
        const size = Number(import.meta.env.VITE_DEFAULT_PAGE_SIZE) || 20;
        return `/characters?name=${encodeURIComponent(query.trim())}&page=${page}&size=${size}`;
      },
      providesTags: ['Character']
    }),
    getCharacterById: builder.query({
      query: (id: string) => `/characters/${id}`,
      providesTags: (id) => [{ type: 'Character', id }]
    })
  })
});

export const {
  useGetAllCharactersQuery,
  useSearchCharactersQuery,
  useGetCharacterByIdQuery
} = supernaturalApi;