# Modal

Modal dialog component for overlays, popups, and dialogs with customizable content and behavior.

**Location:** `src/components/ui/Modal.tsx`

## Overview

The Modal component is a flexible dialog component for displaying content in an overlay. It supports custom titles, footer content, click-outside-to-close behavior, and keyboard navigation (ESC to close). Built on DaisyUI's modal classes for consistent styling.

## Quick Customization

This component is highly customizable:
- **Content** - Any React content (titles, forms, images, etc.)
- **Title** - Optional title prop or custom title element
- **Footer** - Optional footer with buttons or actions
- **Close behavior** - Toggle click-outside-to-close
- **Keyboard support** - ESC key automatically closes modal
- **Styling** - Additional CSS classes for custom styling

## Usage

```tsx
import Modal from "@/components/ui/Modal";
import { useState } from "react";

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <p>Modal content here</p>
      </Modal>
    </>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | Required | Whether modal is open |
| `onClose` | `() => void` | Required | Callback when modal should close |
| `title` | `string` | `undefined` | Optional modal title |
| `children` | `ReactNode` | Required | Modal content |
| `footer` | `ReactNode` | `undefined` | Optional footer content |
| `closeOnOutsideClick` | `boolean` | `true` | Whether to close on outside click |
| `className` | `string` | `""` | Additional CSS classes for modal box |

## Examples

### Basic Modal

```tsx
import Modal from "@/components/ui/Modal";
import { useState } from "react";

function BasicModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <p>This is a basic modal with no title or footer.</p>
      </Modal>
    </>
  );
}
```

### Modal with Title

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
>
  <p>Are you sure you want to proceed?</p>
</Modal>
```

### Modal with Footer

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Delete Item"
  footer={
    <div className="flex gap-2 justify-end">
      <button className="btn btn-ghost" onClick={() => setIsOpen(false)}>
        Cancel
      </button>
      <button className="btn btn-error" onClick={handleDelete}>
        Delete
      </button>
    </div>
  }
>
  <p>This action cannot be undone.</p>
</Modal>
```

### Modal with Form

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Edit Profile"
  footer={
    <div className="flex gap-2 justify-end">
      <button className="btn btn-ghost" onClick={() => setIsOpen(false)}>
        Cancel
      </button>
      <button className="btn btn-primary" onClick={handleSave}>
        Save
      </button>
    </div>
  }
>
  <form className="space-y-4">
    <input type="text" placeholder="Name" />
    <input type="email" placeholder="Email" />
  </form>
</Modal>
```

### Modal without Click-Outside Close

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  closeOnOutsideClick={false}
  title="Important Notice"
>
  <p>This modal cannot be closed by clicking outside.</p>
  <button onClick={() => setIsOpen(false)}>Close</button>
</Modal>
```

### Custom Styled Modal

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  className="max-w-2xl" // Custom max-width
  title="Custom Modal"
>
  <div className="space-y-4">
    <p>Custom styled modal content.</p>
  </div>
</Modal>
```

## Component Structure

```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  closeOnOutsideClick?: boolean;
  className?: string;
}
```

## Behavior

### Opening and Closing

- **Open:** Set `isOpen={true}` to show the modal
- **Close:** Set `isOpen={false}` or call `onClose()` to hide
- **ESC key:** Automatically closes modal when pressed
- **Click outside:** Closes modal if `closeOnOutsideClick={true}` (default)

### Accessibility

- **Focus trap:** Modal should trap focus (can be added with a library)
- **ARIA labels:** Title prop adds semantic structure
- **Keyboard navigation:** ESC key support included

## Styling Notes

- **Base classes:** Uses DaisyUI `modal` and `modal-box` classes
- **Backdrop:** Dark overlay with blur effect (`bg-black/50 backdrop-blur-sm`)
- **Animation:** Smooth transitions for open/close states
- **Max width:** Default max-width, customizable with `className`
- **Responsive:** Adapts to mobile screen sizes

## Best Practices

1. **State management** - Use `useState` or state management library to control `isOpen`
2. **Close handlers** - Always provide an `onClose` callback
3. **Form modals** - Include footer with action buttons (Save/Cancel)
4. **Large content** - Add `max-w-*` classes for large modals
5. **Avoid nesting** - Don't nest modals inside modals (bad UX)

## Tips

- **Simple modals:** Use `title` prop for quick titles
- **Complex modals:** Omit `title` and add custom header JSX in `children`
- **Actions:** Always provide clear action buttons in `footer`
- **Mobile:** Modals work well on mobile with proper max-width
- **Loading states:** Show loading spinner in modal while processing

## Common Use Cases

### Confirmation Dialogs

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Delete"
  footer={
    <>
      <button onClick={() => setIsOpen(false)}>Cancel</button>
      <button onClick={handleConfirm}>Delete</button>
    </>
  }
>
  Are you sure you want to delete this item?
</Modal>
```

### Form Modals

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Create New Item"
  footer={
    <>
      <button onClick={() => setIsOpen(false)}>Cancel</button>
      <button onClick={handleSubmit}>Create</button>
    </>
  }
>
  <form>{/* Form fields */}</form>
</Modal>
```

### Information Modals

```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Information"
>
  <p>Here's some important information...</p>
</Modal>
```

## Learn More

- [Button Component](./button) - Used in modal footers
- [Input Component](./input) - Used in modal forms
- [UI Components Overview](../overview) - All available UI components
