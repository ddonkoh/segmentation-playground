/**
 * -----------------------------------------------------------------------------
 * ShipSafe Form Components — SignupForm.tsx
 * -----------------------------------------------------------------------------
 * Signup form component with email/password/displayName fields.
 * Client-side form with validation.
 *
 * -----------------------------------------------------------------------------
 */

"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { apiPost, handleAPIError } from "@/lib/api";

export interface SignupFormProps {
  /**
   * Callback on successful signup
   */
  onSuccess?: () => void;

  /**
   * Callback on signup error
   */
  onError?: (error: string) => void;
}

/**
 * Signup form component.
 */
const SignupForm = ({
  onSuccess,
  onError,
}: SignupFormProps) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    displayName?: string;
    general?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Za-z]/.test(password)) {
      newErrors.password = "Password must contain at least one letter";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Password must contain at least one number";
    }

    if (!displayName) {
      newErrors.displayName = "Display name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await apiPost("/api/auth/signup", {
        email,
        password,
        displayName,
      });

      if (response.success) {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/dashboard");
        }
      }
    } catch (error) {
      const errorMessage = handleAPIError(error);
      setErrors({ general: errorMessage });
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div className="alert alert-error">
          <span>{errors.general}</span>
        </div>
      )}

      <Input
        type="text"
        label="Display Name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        error={errors.displayName}
        required
        disabled={loading}
        autoComplete="name"
      />

      <Input
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        required
        disabled={loading}
        autoComplete="email"
      />

      <Input
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        required
        disabled={loading}
        autoComplete="new-password"
        helperText="Must be at least 8 characters with letters and numbers"
      />

      <Button type="submit" fullWidth loading={loading}>
        Create Account
      </Button>
    </form>
  );
};

export default SignupForm;

