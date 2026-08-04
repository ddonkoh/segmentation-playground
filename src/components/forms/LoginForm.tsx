/**
 * -----------------------------------------------------------------------------
 * ShipSafe Form Components — LoginForm.tsx
 * -----------------------------------------------------------------------------
 * Login form component with email/password fields.
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

export interface LoginFormProps {
  /**
   * Callback on successful login
   */
  onSuccess?: () => void;

  /**
   * Callback on login error
   */
  onError?: (error: string) => void;
}

/**
 * Login form component.
 */
const LoginForm = ({
  onSuccess,
  onError,
}: LoginFormProps) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
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
      const response = await apiPost("/api/auth/login", {
        email,
        password,
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
        autoComplete="current-password"
      />

      <div className="flex items-center justify-between">
        <a href="/auth/reset" className="link link-primary text-sm">
          Forgot password?
        </a>
      </div>

      <Button type="submit" fullWidth loading={loading}>
        Sign In
      </Button>
    </form>
  );
};

export default LoginForm;

