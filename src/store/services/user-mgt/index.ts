import { api } from '../api';
import {
  CreateRoleRequestType,
  CreateRoleResponseType,
  CreateStaffRequestType,
  CreateStaffResponseType,
  DeactivateStaffRequestType,
  DeactivateStaffResponseType,
  DeleteRoleRequestType,
  DeleteRoleResponseType,
  GetRolesResponseType,
  GetStaffByIdResponseType,
  GetStaffResponseType,
  UpdateRoleRequestType,
  UpdateRoleResponseType,
  UpdateStaffRequestType,
  UpdateStaffResponseType,
} from './typings';

const url = process.env.NEXT_PUBLIC_MEDICATE_BASE_URL;

const userMgt = api.injectEndpoints({
  endpoints: (build) => ({
    createRole: build.mutation<CreateRoleResponseType, CreateRoleRequestType>({
      query: ({ name, description }) => ({
        url: `${url}/auth/create-role`,
        method: 'POST',

        body: { name, description },
      }),
      invalidatesTags: [{ type: 'Role', id: 'LIST' }],
    }),
    getRoles: build.query<GetRolesResponseType, void>({
      query: () => ({
        url: `${url}/auth/get-roles`,
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.roles.map(({ id }) => ({
                type: 'Role' as const,
                id,
              })),
              { type: 'Role', id: 'LIST' },
            ]
          : [{ type: 'Role', id: 'LIST' }],
    }),
    updateRole: build.mutation<UpdateRoleResponseType, UpdateRoleRequestType>({
      query: (payload) => ({
        url: `${url}/auth/update-role`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Role', id: arg.roleId },
        { type: 'Role', id: 'LIST' },
      ],
    }),
    deleteRole: build.mutation<DeleteRoleResponseType, DeleteRoleRequestType>({
      query: ({ roleId }) => ({
        url: `${url}/auth/delete-role`,
        method: 'DELETE',
        body: { roleId },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Role', id: arg.roleId },
        { type: 'Role', id: 'LIST' },
      ],
    }),

    createStaff: build.mutation<
      CreateStaffResponseType,
      CreateStaffRequestType
    >({
      query: (payload) => ({
        url: `${url}/tenant/create-staff`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'Staff', id: 'LIST' }],
    }),

    getStaff: build.query<GetStaffResponseType, void>({
      query: () => ({
        url: `${url}/tenant/staff`,
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.staff.map(({ membershipId }) => ({
                type: 'Staff' as const,
                id: membershipId,
              })),
              { type: 'Staff', id: 'LIST' },
            ]
          : [{ type: 'Staff', id: 'LIST' }],
    }),
    getStaffById: build.query<GetStaffByIdResponseType, string>({
      query: (id) => ({
        url: `${url}/tenant/staff/${id}`,
        method: 'GET',
      }),
    }),
    deactivateStaff: build.mutation<
      DeactivateStaffResponseType,
      DeactivateStaffRequestType
    >({
      query: ({ membershipId }) => ({
        url: `${url}/tenant/staff/deactivate`,
        method: 'PATCH',
        body: { membershipId },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Staff', id: arg.membershipId },
        { type: 'Staff', id: 'LIST' },
      ],
    }),

    updateStaff: build.mutation<
      UpdateStaffResponseType,
      UpdateStaffRequestType
    >({
      query: (payload) => ({
        url: `${url}/tenant/staff/update`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Staff', id: arg.membershipId },
        { type: 'Staff', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateRoleMutation,
  useGetRolesQuery,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useCreateStaffMutation,
  useGetStaffQuery,
  useGetStaffByIdQuery,
  useDeactivateStaffMutation,
  useUpdateStaffMutation,
} = userMgt;
