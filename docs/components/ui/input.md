# Input

Form input component with validation states, error handling, and consistent styling.

**Location:** `src/components/ui/Input.tsx`

## Description

A reusable input component built on top of DaisyUI's input classes. Supports all standard HTML input types, validation states, error messages, and custom styling. Use this component for all form inputs to maintain consistent styling and behavior across your app.

## Usage

```tsx
import Input from "@/components/ui/Input";

<Input
  type="email"
  placeholder="Enter email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `string` | `"text"` | Input type (`text`, `email`, `password`, `number`, etc.) |
| `placeholder` | `string` | - | Placeholder text |
| `value` | `string` | - | Input value (controlled) |
| `onChange` | `function` | - | Change handler `(e: ChangeEvent<HTMLInputElement>) => void` |
| `error` | `string` | - | Error message to display below input |
| `disabled` | `boolean` | `false` | Disable input interaction |
| `required` | `boolean` | `false` | Mark field as required |
| `className` | `string` | `""` | Additional CSS classes |
| `name` | `string` | - | Input name attribute |
| `id` | `string` | - | Input ID attribute |

## Input Types

Supported HTML input types:
- `text` - Standard text input
- `email` - Email input with validation
- `password` - Password input (masked)
- `number` - Number input
- `tel` - Telephone number
- `url` - URL input
- `date` - Date picker
- `time` - Time picker
- And more...

## Examples

### Basic Input

```tsx
<Input
  type="text"
  placeholder="Enter your name"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

### Email Input with Validation

```tsx
const [email, setEmail] = useState("");
const [error, setError] = useState("");

const handleEmailChange = (e) => {
  setEmail(e.target.value);
  // Validate email
  if (e.target.value && !e.target.value.includes("@")) {
    setError("Please enter a valid email address");
  } else {
    setError("");
  }
};

<Input
  type="email"
  placeholder="Email address"
  value={email}
  onChange={handleEmailChange}
  error={error}
  required
/>
```

### Password Input

```tsx
<Input
  type="password"
  placeholder="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  required
/>
```

### Input with Error Message

```tsx
<Input
  type="text"
  placeholder="Username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  error="Username is already taken"
/>
```

### Disabled Input

```tsx
<Input
  type="text"
  placeholder="Read-only field"
  value={readOnlyValue}
  disabled
/>
```

### Full Width Input

```tsx
<Input
  type="text"
  placeholder="Full width input"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  className="w-full"
/>
```

## Validation States

The component automatically shows error state when `error` prop is provided:

- **Normal state** - Standard input styling
- **Error state** - Red border and error message below input
- **Disabled state** - Grayed out and non-interactive

## Features

- **Error handling** - Display error messages below input
- **Validation states** - Visual feedback for invalid inputs
- **Accessibility** - Proper labels and ARIA attributes
- **Type safety** - Full TypeScript support
- **Consistent styling** - Uses DaisyUI classes

## Best Practices

1. **Always use labels** - Pair inputs with `<label>` elements for accessibility
2. **Show errors clearly** - Use `error` prop to display validation messages
3. **Validate on blur** - Validate after user finishes typing
4. **Provide placeholders** - Help users understand expected input format
5. **Mark required fields** - Use `required` prop for required inputs

## Tips

- Use appropriate input types for better mobile UX (email shows @ on mobile keyboard)
- Validate email format client-side before submission
- Show password requirements when creating passwords
- Disable submit button until form is valid
- Clear errors when user starts typing again

## Accessibility

The component is accessible by default:
- Can be paired with `<label>` elements
- Supports ARIA attributes
- Keyboard navigable
- Screen reader friendly

## Learn More

- [Form Components](../forms/overview) - LoginForm and SignupForm using Input
- [LoginForm](../forms/login-form) - Example usage in login form
- [SignupForm](../forms/signup-form) - Example usage in signup form

