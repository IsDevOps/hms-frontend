import { Membership } from '@/store/services/auth/typings';
import { UserRoleTyping } from '@/store/services/base.typing';

export type User = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  profilePictureUrl: string;
  profileCompletionPercentage: number;
  memberships: Membership[];
};

export type AuthState = {
  authRole: UserRoleTyping | null;
  areaOfExpertise: string[] | null;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  resetToken: string | null;
  phoneNumber: string | null;
  newPhoneNumber: string | null;
  userId: string | null;
  displayName: string | null;
  pinSet: boolean;
};
