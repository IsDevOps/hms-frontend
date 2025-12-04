import { ResponseType } from '../base.typing';

type Role = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isDefault: boolean;
};

interface CreateRoleRequestType {
  name: string;
  description: string;
}

interface CreateRoleResponseData {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
}

interface UpdateRoleRequestType {
  roleId: string;
  name?: string;
  description?: string;
  permissions?: string[];
}

interface UpdateRoleResponseData extends CreateRoleResponseData {
  permissions: string[];
}

interface DeleteRoleRequestType {
  roleId: string;
}

interface CreateStaffRequestType {
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  address: string;
  country: string;
  state: string;
  roleId: string;
  pin: string;
  licenseNumber?: string;
  specialty?: string[];
}

interface CreateStaffResponseData {
  id: string;
  user: string;
  tenant: string;
  role: string;
  status: string;
}

interface userType {
  id: string;
  fullName: string;
  email: string;
  phone: string;
}

interface Profile {
  gender?: string;
  country?: string;
  state?: string;
  address?: string;
}

interface RoleInfo {
  id: string;
  name: string;
  permissions: string[];
}

interface GetStaffResponseData {
  membershipId: string;
  status: string;
  user: userType;
  profile: Profile;
  role: RoleInfo;
  staffProfile?: {
    specialty: string[];
    licenseNumber: string;
  };
  licenseNumber?: string;
  specialty?: string;
}

interface DeactivateStaffRequestType {
  membershipId: string;
}

type DeactivateStaffResponseType = {
  _id: string;
  user: string;
  tenant: string;
  role: string;
  status: string;
};

interface UpdateStaffRequestType {
  membershipId: string;
  fullName?: string;
  gender?: string;
  address?: string;
  roleId?: string;
  email?: string;
  phone?: string;
  country?: string;
  state?: string;
  licenseNumber?: string;
  specialty?: string[];
}

interface UpdateStaffResponseData {
  id: string;
  user: {
    id: string;
    fullName: string;
    phone: {
      number: string;
      isVerified: boolean;
    };
    email: string;
    profilePicture: File | null;
    pinSet: boolean;
  };
  tenant: string;
  role: {
    id: string;
    name: string;
    description: string;
    tenant: string;
    permissions: string[];
    isDefault: boolean;
  };
  status: string;
}

type CreateRoleResponseType = ResponseType<CreateRoleResponseData>;
type GetRolesResponseType = ResponseType<{ roles: Role[] }>;
type UpdateRoleResponseType = ResponseType<UpdateRoleResponseData>;
type DeleteRoleResponseType = ResponseType<{ roleId: string }>;
type CreateStaffResponseType = ResponseType<CreateStaffResponseData>;
type UpdateStaffResponseType = ResponseType<UpdateStaffResponseData>;
type GetStaffResponseType = ResponseType<{ staff: GetStaffResponseData[] }>;
type GetStaffByIdResponseType = ResponseType<GetStaffResponseData>;

export type {
  Role,
  CreateRoleRequestType,
  CreateRoleResponseType,
  DeleteRoleRequestType,
  DeleteRoleResponseType,
  GetRolesResponseType,
  UpdateRoleRequestType,
  UpdateRoleResponseType,
  CreateStaffRequestType,
  CreateStaffResponseType,
  GetStaffResponseType,
  GetStaffByIdResponseType,
  GetStaffResponseData,
  DeactivateStaffRequestType,
  DeactivateStaffResponseType,
  UpdateStaffRequestType,
  UpdateStaffResponseType,
};
