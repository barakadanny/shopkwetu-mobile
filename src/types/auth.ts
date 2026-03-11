export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "SHOP_OWNER"
  | "SHOP_STAFF"
  | "PROPERTY_LISTER"
  | "CLIENT"
  | "GUEST";

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: UserRole;
  shopId?: string;
  locale: "fr" | "en";
  permissions: string[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

/** Roles that can access the seller dashboard */
export const DASHBOARD_ROLES: UserRole[] = [
  "SHOP_OWNER",
  "SHOP_STAFF",
  "PROPERTY_LISTER",
];

/** Roles that can access admin panel */
export const ADMIN_ROLES: UserRole[] = ["SUPER_ADMIN", "ADMIN"];
