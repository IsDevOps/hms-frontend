import { User } from '@/store/reducers/auth/typings';

/** NB: tenanId i am passing to the individual functions
    is helpful for multiple tenants 
    i.e user can be a tenant for 2 or more org in thr future
**/

const hasPermission = (
  user: User | null,
  permission: string,
  tenantId: string | null = null
) => {
  if (!user?.memberships?.length) return true; // for everyday user

  if (tenantId) {
    const membership = user?.memberships?.find((m) => m.tenantId === tenantId);
    return membership?.permissions?.includes(permission);
  }
};

const hasRole = (
  user: User | null,
  role: string,
  tenantId: string | null = null
): boolean => {
  if (!user?.memberships?.length) return false;

  if (tenantId) {
    const membership = user?.memberships?.find((m) => m.tenantId === tenantId);
    return membership?.role === role;
  }

  return user.memberships.some((m) => m.role === role);
};

const getTenantType = (user: User | null, tenantId: string | null = null) => {
  if (!user?.memberships?.length) return 'INDIVIDUAL_USER';

  if (tenantId) {
    // to get tenantType for specific tenantId
    const membership = user?.memberships?.find((m) => m.tenantId === tenantId);
    return membership?.tenantType ?? 'INDIVIDUAL_USER';
  }

  // else fallback to finding the heighest priority
  const tenantTypes = user?.memberships?.map((m) => m.tenantType);
  if (tenantTypes.includes('HEALTHCARE_PROVIDER')) return 'HEALTHCARE_PROVIDER';
  if (tenantTypes.includes('HMO')) return 'HMO';
  if (tenantTypes.includes('HEALTHCARE_PRACTITIONER'))
    return 'HEALTHCARE_PRACTITIONER'; // practitioner here
  if (tenantTypes.includes('PHARMACY')) return 'PHARMACY';
  return 'INDIVIDUAL_USER';
};

const getActiveTenant = (user: User | null) => {
  // subsequently can implement tenant switching logic here
  // for multiple tenat
  return user?.memberships?.[0] || null;
};

export { hasPermission, hasRole, getTenantType, getActiveTenant };
