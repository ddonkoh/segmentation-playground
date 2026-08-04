# LoginForm

Login form component with email/password fields, validation, and error handling.

**Location:** `src/components/forms/LoginForm.tsx`

## Overview

The LoginForm component provides a complete login experience with email and password fields. It includes client-side validation, error handling, loading states, and automatic redirection to the dashboard on success. The form integrates with Firebase Authentication via the `/api/auth/login` endpoint.

## Quick Customization

This component is highly customizable:
- **Success callback** - Custom `onSuccess` handler for post-login actions
- **Error callback** - Custom `onError` handler for error handling
- **Redirect destination** - Defaults to `/dashboard` (configure in `config.ts`)
- **Validation** - Email format and required field validation
- **Styling** - Uses DaisyUI components (Input, Button, Alert)
- **Password reset link** - Links to `/auth/reset` for password recovery

## Usage

```tsx
import LoginForm from "@/components/forms/LoginForm";

<LoginForm />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSuccess` | `() => void` | `undefined` | Callback when login succeeds (overrides default redirect) |
| `onError` | `(error: string) => void` | `undefined` | Callback when login fails |

## Examples

### Basic Usage

```tsx
import LoginForm from "@/components/forms/LoginForm";

// Standard login form
<LoginForm />
```

### With Custom Success Handler

```tsx
import LoginForm from "@/components/forms/LoginForm";
import { useRouter } from "next/navigation";

function CustomLogin() {
  const router = useRouter();

  return (
    <LoginForm
      onSuccess={() => {
        // Custom logic after login
        console.log("User logged in!");
        router.push("/custom-destination");
      }}
    />
  );
}
```

### With Custom Error Handling

```tsx
import LoginForm from "@/components/forms/LoginForm";

<LoginForm
  onError={(error) => {
    // Custom error handling
    console.error("Login failed:", error);
    // Show custom notification, etc.
  }}
/>
```

### Complete Example with Both Callbacks

```tsx
import LoginForm from "@/components/forms/LoginForm";

<LoginForm
  onSuccess={() => {
    // Redirect or show success message
    router.push("/dashboard");
  }}
  onError={(error) => {
    // Handle error (e.g., show toast notification)
    toast.error(error);
  }}
/>
```

## Features

### Form Fields

- **Email input** - Validated email format, required field
- **Password input** - Required field, masked input
- **Forgot password link** - Links to `/auth/reset` for password recovery

### Validation

- **Email format** - Validates email pattern (`/\S+@\S+\.\S+/`)
- **Required fields** - Both email and password are required
- **Error display** - Shows field-specific and general errors

### User Experience

- **Loading state** - Shows loading spinner on submit button
- **Disabled inputs** - Inputs disabled during submission
- **Auto-redirect** - Redirects to `/dashboard` on success (or custom `onSuccess`)
- **Error messages** - Clear error messages for validation and API errors

## Component Structure

```tsx
interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const LoginForm = ({ onSuccess, onError }: LoginFormProps) => {
  // State management
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Validation and submit logic
  // ...
};
```

## Validation Rules

### Email

- **Required:** Yes
- **Format:** Must be valid email format (`user@example.com`)
- **Error message:** "Email is required" or "Email is invalid"

### Password

- **Required:** Yes
- **Error message:** "Password is required"

## API Integration

The form calls `/api/auth/login` endpoint:

```typescript
// POST /api/auth/login
{
  email: string;
  password: string;
}
```

**Response:**
- Success: Sets session cookie and returns `{ success: true }`
- Error: Returns error message in response

## Customization

### Change Redirect Destination

**Option 1:** Use `onSuccess` prop:

```tsx
<LoginForm
  onSuccess={() => router.push("/custom-page")}
/>
```

**Option 2:** Update `config.ts`:

```typescript
// config.ts
auth: {
  callbackUrl: "/your-custom-page",
  // ...
}
```

### Customize Validation

Edit the `validate` function in `LoginForm.tsx`:

```tsx
const validate = () => {
  const newErrors = {};

  // Add custom validation rules
  if (email && !email.includes("@yourcompany.com")) {
    newErrors.email = "Must use company email";
  }

  // ... existing validation

  return Object.keys(newErrors).length === 0;
};
```

### Customize Styling

The form uses DaisyUI components. Modify classes:

```tsx
// In LoginForm.tsx
<form onSubmit={handleSubmit} className="space-y-6"> {/* Change spacing */}
  {/* ... */}
</form>
```

## Styling Notes

- **Form container:** Uses `space-y-4` for vertical spacing
- **Inputs:** Uses `Input` component with validation states
- **Button:** Uses `Button` component with loading state
- **Errors:** Uses DaisyUI `alert alert-error` for error display
- **Link:** Uses `link link-primary` for password reset link

## Best Practices

1. **Error handling** - Always provide `onError` callback for better UX
2. **Loading states** - Form automatically handles loading (inputs disabled)
3. **Accessibility** - Form includes proper labels and autoComplete attributes
4. **Security** - Password field uses `type="password"` for masking
5. **Redirects** - Use `onSuccess` for custom post-login flows

## Tips

- **Success callback:** Overrides default redirect if provided
- **Error callback:** Use for custom error notifications (toasts, alerts)
- **Password reset:** Link automatically goes to `/auth/reset`
- **Auto-complete:** Form includes proper `autoComplete` attributes
- **Validation:** Client-side validation happens before API call

## Learn More

- [Input Component](../ui/input) - Base input component used in form
- [Button Component](../ui/button) - Submit button component
- [SignupForm Component](./signup-form) - User registration form
- [Authentication Features](../../features/authentication) - Complete auth guide
