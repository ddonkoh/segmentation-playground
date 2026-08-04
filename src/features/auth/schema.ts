/**
 * -----------------------------------------------------------------------------
 * ShipSafe Auth Features — schema.ts
 * -----------------------------------------------------------------------------
 * Overview:
 *   Zod validation schemas for all authentication operations.
 *   Ensures type safety and input validation for auth API routes.
 *
 * Why this exists:
 *   All API routes must validate incoming data using Zod schemas.
 *   This centralizes auth-related validation logic.
 *
 * Security:
 *   - Validates email format
 *   - Enforces password strength requirements
 *   - Sanitizes input data
 *   - Prevents injection attacks through validation
 *
 * Used by:
 *   - API routes (/api/auth/*)
 *   - Features/auth (login, signup, reset functions)
 *
 * -----------------------------------------------------------------------------
 */

import { z } from "zod";

// -----------------------------------------------------------------------------
// 1. Email Schema
// -----------------------------------------------------------------------------

/**
 * Email validation schema.
 * Normalizes email to lowercase and trims whitespace.
 */
export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email address")
  .toLowerCase()
  .trim();

// -----------------------------------------------------------------------------
// 2. Password Schema
// -----------------------------------------------------------------------------

/**
 * Password validation schema.
 * Enforces strong password requirements:
 *   - Minimum 8 characters
 *   - At least one letter
 *   - At least one number
 */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Za-z]/, "Password must contain at least one letter")
  .regex(/[0-9]/, "Password must contain at least one number");

// -----------------------------------------------------------------------------
// 3. Login Schema
// -----------------------------------------------------------------------------

/**
 * Login request schema.
 * Used for POST /api/auth/login
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

/**
 * Type for login input (inferred from schema).
 */
export type LoginInput = z.infer<typeof loginSchema>;

// -----------------------------------------------------------------------------
// 4. Signup Schema
// -----------------------------------------------------------------------------

/**
 * Signup request schema.
 * Used for POST /api/auth/signup
 */
export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  displayName: z
    .string()
    .min(1, "Display name is required")
    .max(100, "Display name must be less than 100 characters")
    .trim()
    .optional(),
});

/**
 * Type for signup input (inferred from schema).
 */
export type SignupInput = z.infer<typeof signupSchema>;

// -----------------------------------------------------------------------------
// 5. Password Reset Request Schema
// -----------------------------------------------------------------------------

/**
 * Password reset request schema (send reset email).
 * Used for POST /api/auth/reset
 */
export const sendPasswordResetSchema = z.object({
  email: emailSchema,
});

/**
 * Type for send password reset input (inferred from schema).
 */
export type SendPasswordResetInput = z.infer<typeof sendPasswordResetSchema>;

// -----------------------------------------------------------------------------
// 6. Password Reset Verification Schema
// -----------------------------------------------------------------------------

/**
 * Password reset verification schema (update password).
 * Used for POST /api/auth/reset/verify
 */
export const verifyPasswordResetSchema = z.object({
  oobCode: z.string().min(1, "Reset code is required"),
  newPassword: passwordSchema,
});

/**
 * Type for verify password reset input (inferred from schema).
 */
export type VerifyPasswordResetInput = z.infer<typeof verifyPasswordResetSchema>;

// -----------------------------------------------------------------------------
// 7. Google OAuth Schema (Optional)
// -----------------------------------------------------------------------------

/**
 * Google OAuth sign-in schema.
 * Used for POST /api/auth/google (if implemented)
 */
export const googleSignInSchema = z.object({
  idToken: z.string().min(1, "ID token is required"),
});

/**
 * Type for Google sign-in input (inferred from schema).
 */
export type GoogleSignInInput = z.infer<typeof googleSignInSchema>;

