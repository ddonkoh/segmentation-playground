/**
 * -----------------------------------------------------------------------------
 * ShipSafe Models — user.ts
 * -----------------------------------------------------------------------------
 * Overview:
 *   User model definitions, Firestore converters, and validation schemas.
 *   Provides type-safe user data structures for the application.
 *
 * Why this exists:
 *   User data is stored in Firestore and accessed throughout the app.
 *   This file ensures type safety and provides converters for Firestore.
 *
 * Security:
 *   - User data should never include sensitive information (passwords, tokens)
 *   - Email verification status is tracked
 *   - Roles are stored in Firebase custom claims (not in Firestore)
 *
 * Used by:
 *   - Features/auth (user creation, updates)
 *   - Features/billing (user subscription linking)
 *   - API routes (user data responses)
 *   - Components (user profile display)
 *
 * -----------------------------------------------------------------------------
 */

import { z } from "zod";
import { Timestamp } from "firebase-admin/firestore";
import { UserRole } from "./roles";

// -----------------------------------------------------------------------------
// 1. User Interface
// -----------------------------------------------------------------------------

/**
 * User data stored in Firestore.
 * This represents the user document structure.
 */
export interface User {
  /**
   * Firebase Authentication UID (primary key)
   */
  uid: string;

  /**
   * User email address
   */
  email: string;

  /**
   * User display name
   */
  displayName: string | null;

  /**
   * User profile photo URL
   */
  photoURL: string | null;

  /**
   * Whether email is verified
   */
  emailVerified: boolean;

  /**
   * Stripe customer ID (if user has subscription)
   */
  stripeCustomerId: string | null;

  /**
   * Stripe subscription ID (if user has subscription)
   */
  subscriptionId: string | null;

  /**
   * Subscription status (if user has subscription)
   */
  subscriptionStatus: string | null;

  /**
   * User creation timestamp
   */
  createdAt: Date;

  /**
   * Last update timestamp
   */
  updatedAt: Date;

  /**
   * Last sign-in timestamp
   */
  lastSignInAt: Date | null;

  /**
   * Whether user account is disabled
   */
  disabled: boolean;
}

// -----------------------------------------------------------------------------
// 2. User Creation Input
// -----------------------------------------------------------------------------

/**
 * Input data for creating a new user.
 */
export interface CreateUserInput {
  email: string;
  password?: string;
  displayName?: string;
  photoURL?: string;
  emailVerified?: boolean;
}

// -----------------------------------------------------------------------------
// 3. User Update Input
// -----------------------------------------------------------------------------

/**
 * Input data for updating user information.
 */
export interface UpdateUserInput {
  displayName?: string;
  photoURL?: string;
  emailVerified?: boolean;
  stripeCustomerId?: string;
  subscriptionId?: string;
  subscriptionStatus?: string;
}

// -----------------------------------------------------------------------------
// 4. Zod Schemas
// -----------------------------------------------------------------------------

/**
 * Email validation schema.
 */
const emailSchema = z.string().email("Invalid email address").toLowerCase().trim();

/**
 * Password validation schema.
 * Minimum 8 characters, at least one letter and one number.
 */
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Za-z]/, "Password must contain at least one letter")
  .regex(/[0-9]/, "Password must contain at least one number");

/**
 * Zod schema for user creation input.
 */
export const createUserInputSchema = z.object({
  email: emailSchema,
  password: passwordSchema.optional(),
  displayName: z.string().min(1).max(100).optional(),
  photoURL: z.string().url("Invalid photo URL").optional(),
  emailVerified: z.boolean().optional().default(false),
});

/**
 * Zod schema for user update input.
 */
export const updateUserInputSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  photoURL: z.string().url("Invalid photo URL").optional(),
  emailVerified: z.boolean().optional(),
  stripeCustomerId: z.string().optional(),
});

/**
 * Zod schema for email validation.
 */
export const emailSchemaValidation = emailSchema;

/**
 * Zod schema for password validation.
 */
export const passwordSchemaValidation = passwordSchema;

// -----------------------------------------------------------------------------
// 5. Firestore Converters
// -----------------------------------------------------------------------------

/**
 * Convert Firestore document to User object.
 * Handles Timestamp to Date conversion.
 *
 * @param data - Firestore document data
 * @returns User object
 */
export function userFromFirestore(data: {
  uid: string;
  email: string;
  displayName?: string | null;
  photoURL?: string | null;
  emailVerified?: boolean;
  stripeCustomerId?: string | null;
  subscriptionId?: string | null;
  subscriptionStatus?: string | null;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  lastSignInAt?: Timestamp | Date | null;
  disabled?: boolean;
}): User {
  const convertTimestamp = (ts: Timestamp | Date | null | undefined): Date | null => {
    if (!ts) return null;
    if (ts instanceof Date) return ts;
    if (ts instanceof Timestamp) return ts.toDate();
    return null;
  };

  return {
    uid: data.uid,
    email: data.email,
    displayName: data.displayName ?? null,
    photoURL: data.photoURL ?? null,
    emailVerified: data.emailVerified ?? false,
    stripeCustomerId: data.stripeCustomerId ?? null,
    subscriptionId: data.subscriptionId ?? null,
    subscriptionStatus: data.subscriptionStatus ?? null,
    createdAt: convertTimestamp(data.createdAt) ?? new Date(),
    updatedAt: convertTimestamp(data.updatedAt) ?? new Date(),
    lastSignInAt: convertTimestamp(data.lastSignInAt),
    disabled: data.disabled ?? false,
  };
}

/**
 * Convert User object to Firestore document data.
 * Converts Date to Timestamp for Firestore storage.
 *
 * @param user - User object
 * @returns Firestore document data
 */
export function userToFirestore(user: User): {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  stripeCustomerId: string | null;
  subscriptionId: string | null;
  subscriptionStatus: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastSignInAt: Timestamp | null;
  disabled: boolean;
} {
  const convertDate = (date: Date | null): Timestamp | null => {
    if (!date) return null;
    return Timestamp.fromDate(date);
  };

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
    stripeCustomerId: user.stripeCustomerId,
    subscriptionId: user.subscriptionId,
    subscriptionStatus: user.subscriptionStatus,
    createdAt: convertDate(user.createdAt) ?? Timestamp.now(),
    updatedAt: convertDate(user.updatedAt) ?? Timestamp.now(),
    lastSignInAt: convertDate(user.lastSignInAt),
    disabled: user.disabled,
  };
}

// -----------------------------------------------------------------------------
// 6. User Utilities
// -----------------------------------------------------------------------------

/**
 * Create a new user object with default values.
 *
 * @param uid - Firebase UID
 * @param email - User email
 * @param input - Optional user input data
 * @returns New User object
 */
export function createUserObject(
  uid: string,
  email: string,
  input?: Partial<CreateUserInput>
): User {
  const now = new Date();

  return {
    uid,
    email: email.toLowerCase().trim(),
    displayName: input?.displayName ?? null,
    photoURL: input?.photoURL ?? null,
    emailVerified: input?.emailVerified ?? false,
    stripeCustomerId: null,
    subscriptionId: null,
    subscriptionStatus: null,
    createdAt: now,
    updatedAt: now,
    lastSignInAt: null,
    disabled: false,
  };
}

/**
 * Check if user has active subscription (has Stripe customer ID).
 *
 * @param user - User object
 * @returns true if user has Stripe customer ID
 */
export function hasStripeCustomer(user: User): boolean {
  return user.stripeCustomerId !== null && user.stripeCustomerId.length > 0;
}

// -----------------------------------------------------------------------------
// 7. Type Exports
// -----------------------------------------------------------------------------

/**
 * Type for user creation input (inferred from schema).
 */
export type CreateUserInputType = z.infer<typeof createUserInputSchema>;

/**
 * Type for user update input (inferred from schema).
 */
export type UpdateUserInputType = z.infer<typeof updateUserInputSchema>;

