import { api } from '../api';
import { UploadResponseType } from './typings';

const url = process.env.NEXT_PUBLIC_MEDICATE_BASE_URL;

const others = api.injectEndpoints({
  endpoints: (build) => ({
    uploadDocument: build.mutation<UploadResponseType, FormData>({
      // to be used for most document/images upload unless specified otherwise
      query: (formData) => ({
        url: `${url}/auth/upload-file`,
        method: 'POST',
        body: formData,
      }),
    }),
    deleteProfilePicture: build.mutation({
      query: () => ({
        url: `${url}/auth/profile-picture`,
        method: 'DELETE',
      }),
    }),
    deleteLogo: build.mutation({
      query: () => ({
        url: `${url}/tenant/logo`,
        method: 'DELETE',
      }),
    }),
    getCountries: build.query<{ id: string; name: string }[], void>({
      queryFn: async () => {
        try {
          const res = await fetch(
            'https://countriesnow.space/api/v0.1/countries'
          );
          if (!res.ok) throw new Error('Failed to fetch countries');
          const result = await res.json();

          if (!Array.isArray(result.data)) {
            return { error: { status: 500, data: 'Invalid country format' } };
          }

          const countries = result.data.map((c: any) => ({
            id: c.country.toLocaleLowerCase(),
            name: c.country,
          }));

          return { data: countries };
        } catch (error: any) {
          console.error('Country fetch error:', error);
          return { error: { status: 500, data: 'Country fetch failed' } };
        }
      },
    }),
    getStates: build.query<{ id: string; name: string }[], string>({
      queryFn: async (country: string) => {
        try {
          if (country?.toLocaleLowerCase() === 'nigeria') {
            // use json file data
            const nigeriaStates = await import(
              '@/lib/nigeria-states-and-lgas.json'
            );
            const states = nigeriaStates.default.map((s) => ({
              id: s.state.toLocaleLowerCase(),
              name: s.state,
            }));
            return { data: states };
          } else {
            const res = await fetch(
              'https://countriesnow.space/api/v0.1/countries/states',
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ country }),
              }
            );

            if (!res.ok) throw new Error('Failed to fetch countries');
            const result = await res.json();

            if (!Array.isArray(result.data?.states)) {
              return { error: { status: 500, data: 'Invalid country format' } };
            }
            const states = result.data.states.map(
              (s: { name: string; state_code: string }) => ({
                id: s.name.toLocaleLowerCase(),
                name: s.name,
              })
            );
            return { data: states };
          }
        } catch (err) {
          console.log('Country fetch error:', err);
          return { error: { status: 500, data: 'States fetch failed' } };
        }
      },
    }),
    getLgas: build.query<
      { id: string; name: string }[],
      { country: string; state: string }
    >({
      queryFn: async (payload) => {
        try {
          if (payload.country?.toLocaleLowerCase() === 'nigeria') {
            // use json file data
            const nigeriaStates = await import(
              '@/lib/nigeria-states-and-lgas.json'
            );
            const selectedState = nigeriaStates.default.find(
              (s) => s.state.toLocaleLowerCase() === payload.state
            );

            if (!selectedState) {
              return { error: { status: 404, data: 'State not found' } };
            }
            const lgas = selectedState?.lgas.map((l) => ({
              id: l.toLocaleLowerCase(),
              name: l,
            }));
            return { data: lgas };
          } else {
            const res = await fetch(
              'https://countriesnow.space/api/v0.1/countries/state/cities',
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  country: payload.country,
                  state: payload.state,
                }),
              }
            );

            if (!res.ok) throw new Error('Failed to fetch countries');
            const result = await res.json();

            if (!Array.isArray(result.data)) {
              return { error: { status: 500, data: 'Invalid country format' } };
            }

            const lgas = result.data.map((l: string) => ({
              id: l.toLocaleLowerCase(),
              name: l,
            }));

            return { data: lgas };
          }
        } catch (err) {
          console.log('Country fetch error:', err);
          return { error: { status: 500, data: 'States fetch failed' } };
        }
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useUploadDocumentMutation,
  useGetCountriesQuery,
  useGetStatesQuery,
  useGetLgasQuery,
  useLazyGetStatesQuery,
  useLazyGetLgasQuery,
  useDeleteProfilePictureMutation,
  useDeleteLogoMutation,
} = others;
