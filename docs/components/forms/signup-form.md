# SignupForm

Signup form component with email, password, and display name fields, including comprehensive validation.

**Location:** `src/components/forms/SignupForm.tsx`

## Overview

The SignupForm component provides a complete user registration experience with email, password, and display name fields. It includes robust client-side validation (including password strength requirements), error handling, loading states, and automatic redirection to the dashboard on success. The form integrates with Firebase Authentication via the `/api/auth/signup` endpoint.

## Quick Customization

This component is highly customizable:
- **Success callback** - Custom `onSuccess` handler for post-signup actions
- **Error callback** - Custom `onError` handler for error handling
- **Redirect destination** - Defaults to `/dashboard` (configure in `config.ts`)
- **Validation rules** - Password strength, email format, required fields
- **Styling** - Uses DaisyUI components (Input, Button, Alert)
- **Helper text** - Password field includes helper text for requirements

## Usage

```tsx
import SignupForm from "@/components/forms/SignupForm";

<SignupForm />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSuccess` | `() => void` | `undefined` | Callback when signup succeeds (overrides default redirect) |
| `onError` | `(error: string) => void` | `undefined` | Callback when signup fails |

## Examples

### Basic Usage

```tsx
import SignupForm from "@/components/forms/SignupForm";

// Standard signup form
<SignupForm />
```

### With Custom Success Handler

```tsx
import SignupForm from "@/components/forms/SignupForm";
import { useRouter } from "next/navigation";

function CustomSignup() {
  const router = useRouter();

  return (
    <SignupForm
      onSuccess={() => {
        // Custom logic after signup
        console.log("User registered!");
        router.push("/onboarding");
      }}
    />
  );
}
```

### With Custom Error Handling

```tsx
import SignupForm from "@/components/forms/SignupForm";

<SignupForm
  onError={(error) => {
    // Custom error handling
    console.error("Signup failed:", error);
    // Show custom notification, etc.
  }}
/>
```

### Complete Example with Both Callbacks

```tsx
import SignupForm from "@/components/forms/SignupForm";

<SignupForm
  onSuccess={() => {
    // Redirect to onboarding
    router.push("/onboarding");
  }}
  onError={(error) => {
    // Handle error (e.g., show toast notification)
    toast.error(error);
  }}
/>
```

## Features

### Form Fields

- **Display Name input** - User's display name, required field
- **Email input** - Validated email format, required field
- **Password input** - Required field with strength validation, masked input
- **Helper text** - Password field shows requirements

### Validation

- **Display Name** - Required field
- **Email format** - Validates email pattern (`/\S+@\S+\.\S+/`)
- **Password strength:**
  - Minimum 8 characters
  - At least one letter
  - At least one number
- **Required fields** - All fields are required
- **Error display** - Shows field-specific and general errors

### User Experience

- **Loading state** - Shows loading spinner on submit button
- **Disabled inputs** - Inputs disabled during submission
- **Auto-redirect** - Redirects to `/dashboard` on success (or custom `onSuccess`)
- **Error messages** - Clear error messages for validation and API errors
- **Helper text** - Password field shows requirements below input

## Component Structure

```tsx
interface SignupFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const SignupForm = ({ onSuccess, onError }: SignupFormProps) => {
  // State management
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Validation and submit logic
  // ...
};
```

## Validation Rules

### Display Name

- **Required:** Yes
- **Error message:** "Display name is required"

### Email

- **Required:** Yes
- **Format:** Must be valid email format (`user@example.com`)
- **Error message:** "Email is required" or "Email is invalid"

### Password

- **Required:** Yes
- **Minimum length:** 8 characters
- **Must contain:** At least one letter (a-z, A-Z)
- **Must contain:** At least one number (0-9)
- **Error messages:**
  - "Password is required"
  - "Password must be at least 8 characters"
  - "Password must contain at least one letter"
  - "Password must contain at least one number"

## API Integration

The form calls `/api/auth/signup` endpoint:

```typescript
// POST /api/auth/signup
{
  email: string;
  password: string;
  displayName: string;
}
```

**Response:**
- Success: Creates user account, sets session cookie, returns `{ success: true }`
- Error: Returns error message in response (e.g., email already exists)

## Customization

### Change Redirect Destination

**Option 1:** Use `onSuccess` prop:

```tsx
<SignupForm
  onSuccess={() => router.push("/onboarding")}
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

### Customize Password Requirements

Edit the `validate` function in `SignupForm.tsx`:

```tsx
const validate = () => {
  const newErrors = {};

  // Custom password requirements
  if (password.length < 12) { // Change minimum length
    newErrors.password = "Password must be at least 12 characters";
  }

  if (!/[A-Z]/.test(password)) { // Require uppercase
    newErrors.password = "Password must contain an uppercase letter";
  }

  if (!/[!@#$%^&*]/.test(password)) { // Require special character
    newErrors.password = "Password must contain a special character";
  }

  // ... existing validation

  return Object.keys(newErrors).length === 0;
};
```

**Update helper text:**

```tsx
<Input
  type="password"
  label="Password"
  helperText="Must be at least 12 characters with uppercase, lowercase, number, and special character"
  // ...
/>
```

### Customize Validation

Edit the `validate` function in `SignupForm.tsx`:

```tsx
const validate = () => {
  const newErrors = {};

  // Custom display name validation
  if (displayName.length < 3) {
    newErrors.displayName = "Display name must be at least 3 characters";
  }

  // Custom email validation
  if (email && !email.endsWith("@yourcompany.com")) {
    newErrors.email = "Must use company email";
  }

  // ... existing validation

  return Object.keys(newErrors).length === 0;
};
```

### Customize Styling

The form uses DaisyUI components. Modify classes:

```tsx
// In SignupForm.tsx
<form onSubmit={handleSubmit} className="space-y-6"> {/* Change spacing */}
  {/* ... */}
</form>
```

## Styling Notes

- **Form container:** Uses `space-y-4` for vertical spacing
- **Inputs:** Uses `Input` component with validation states
- **Button:** Uses `Button` component with loading state
- **Errors:** Uses DaisyUI `alert alert-error` for error display
- **Helper text:** Password field shows requirements below input

## Best Practices

1. **Password strength** - Current requirements are a good balance (not too strict, not too weak)
2. **Error handling** - Always provide `onError` callback for better UX
3. **Loading states** - Form automatically handles loading (inputs disabled)
4. **Accessibility** - Form includes proper labels and autoComplete attributes
5. **Security** - Password field uses `type="password"` for masking
6. **User feedback** - Helper text helps users understand requirements upfront

## Tips

- **Success callback:** Overrides default redirect if provided
- **Error callback:** Use for custom error notifications (toasts, alerts)
- **Password requirements:** Helper text shows requirements to reduce errors
- **Auto-complete:** Form includes proper `autoComplete` attributes
- **Validation:** Client-side validation happens before API call
- **Display name:** Use for user's display name (can be different from email)

## Learn More

- [Input Component](../ui/input) - Base input component used in form
- [Button Component](../ui/button) - Submit button component
- [LoginForm Component](./login-form) - User login form
- [Authentication Features](../../features/authentication) - Complete auth guide
- [Validation Features](../../features/validation) - Validation patterns and best practices
