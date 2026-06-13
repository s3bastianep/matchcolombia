export const ROLES = {
  ADMIN: "admin",
  SEEKER: "seeker",
  OWNER: "owner",
  TENANT: "tenant",
};

export const ROLE_LABELS = {
  admin: "Administrador",
  seeker: "Buscador",
  owner: "Propietario",
  tenant: "Inquilino",
};

export const PANEL_HOME = {
  admin: "/admin",
  seeker: "/portal",
  owner: "/propietario",
  tenant: "/inquilino",
};

export function getUserRole(user) {
  return user?.role || ROLES.SEEKER;
}

export function canAccessPanel(user, allowedRoles) {
  if (!user) return false;
  return allowedRoles.includes(getUserRole(user));
}
