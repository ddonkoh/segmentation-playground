/**
 * -----------------------------------------------------------------------------
 * ShipSafe Models — roles.ts
 * -----------------------------------------------------------------------------
 * Overview:
 *   Role-based access control (RBAC) type definitions.
 *   Defines user roles, permissions, and access levels.
 *
 * Why this exists:
 *   ShipSafe uses Firebase custom claims for role management.
 *   This file provides TypeScript types for type-safe role checking.
 *
 * Security:
 *   - Roles are stored in Firebase custom claims
 *   - Server-side role verification required
 *   - Client-side role checks are for UI only (not security)
 *
 * Used by:
 *   - User model (role assignment)
 *   - Features/auth (role management)
 *   - API routes (authorization checks)
 *   - Components (UI conditional rendering)
 *
 * -----------------------------------------------------------------------------
 * SECURITY NOTE:
 *   Role checks in client components are for UX only. Always verify
 *   roles server-side using Firebase Admin SDK custom claims.
 * -----------------------------------------------------------------------------
 */

// -----------------------------------------------------------------------------
// 1. User Roles
// -----------------------------------------------------------------------------

/**
 * User role enum.
 * Roles determine what actions a user can perform.
 */
export enum UserRole {
  /**
   * Default role for new users.
   * Limited access, can view dashboard but may have restricted features.
   */
  USER = "user",

  /**
   * Premium/subscribed users.
   * Full access to all features based on their subscription plan.
   */
  PREMIUM = "premium",

  /**
   * Administrative users.
   * Full system access (use with caution).
   */
  ADMIN = "admin",
}

// -----------------------------------------------------------------------------
// 2. Subscription Tiers (for role assignment)
// -----------------------------------------------------------------------------

/**
 * Subscription tier enum.
 * Maps to Stripe subscription plans and determines user role.
 */
export enum SubscriptionTier {
  /**
   * Free tier (no subscription).
   * Maps to UserRole.USER
   */
  FREE = "free",

  /**
   * Starter plan subscription.
   * Maps to UserRole.PREMIUM
   */
  STARTER = "starter",

  /**
   * Pro plan subscription.
   * Maps to UserRole.PREMIUM
   */
  PRO = "pro",
}

// -----------------------------------------------------------------------------
// 3. Permissions
// -----------------------------------------------------------------------------

/**
 * Permission enum.
 * Granular permissions for feature access control.
 */
export enum Permission {
  // Dashboard permissions
  VIEW_DASHBOARD = "view_dashboard",
  ACCESS_ANALYTICS = "access_analytics",

  // Billing permissions
  VIEW_BILLING = "view_billing",
  MANAGE_SUBSCRIPTION = "manage_subscription",

  // Feature permissions
  USE_PREMIUM_FEATURES = "use_premium_features",
  EXPORT_DATA = "export_data",

  // Admin permissions
  MANAGE_USERS = "manage_users",
  VIEW_ADMIN_PANEL = "view_admin_panel",
  MANAGE_SETTINGS = "manage_settings",
}

// -----------------------------------------------------------------------------
// 4. Role-Permission Mapping
// -----------------------------------------------------------------------------

/**
 * Maps roles to their allowed permissions.
 * Used for server-side authorization checks.
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.USER]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_BILLING,
  ],

  [UserRole.PREMIUM]: [
    Permission.VIEW_DASHBOARD,
    Permission.ACCESS_ANALYTICS,
    Permission.VIEW_BILLING,
    Permission.MANAGE_SUBSCRIPTION,
    Permission.USE_PREMIUM_FEATURES,
    Permission.EXPORT_DATA,
  ],

  [UserRole.ADMIN]: [
    // Admins have all permissions
    ...Object.values(Permission),
  ],
};

// -----------------------------------------------------------------------------
// 5. Helper Functions
// -----------------------------------------------------------------------------

/**
 * Check if a role has a specific permission.
 *
 * @param role - User role
 * @param permission - Permission to check
 * @returns true if role has permission
 */
export function hasPermission(
  role: UserRole,
  permission: Permission
): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Get all permissions for a role.
 *
 * @param role - User role
 * @returns Array of permissions
 */
export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

/**
 * Check if user has premium access (PREMIUM or ADMIN role).
 *
 * @param role - User role
 * @returns true if user has premium access
 */
export function hasPremiumAccess(role: UserRole): boolean {
  return role === UserRole.PREMIUM || role === UserRole.ADMIN;
}

// -----------------------------------------------------------------------------
// 6. Type Exports
// -----------------------------------------------------------------------------

/**
 * Type for role strings (useful for API responses).
 */
export type RoleString = keyof typeof UserRole;

/**
 * Type for permission strings (useful for API responses).
 */
export type PermissionString = keyof typeof Permission;

