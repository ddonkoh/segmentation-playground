# Cursor AI Prompts for ShipSafe

Ready-to-use prompts for Cursor AI to accelerate ShipSafe development. Copy and paste these prompts directly into Cursor's chat.

**Status:** v1.0 - Production-tested patterns  
**Validated:** All patterns tested in ThinkMate.online production deployment

---

## 🚀 Quick Start Prompts

### Create a New API Route

```
Create a new API route at /api/user/profile that allows authenticated users to update their profile (name, email). Follow ShipSafe v1.0 patterns:
- Use requireAuth from @/lib/firebase/auth (returns 401 for unauthenticated)
- Validate input with Zod schema in src/features/user/schema.ts
- Put business logic in src/features/user/server.ts
- Return consistent format: { success: boolean, data?: any, error?: string }
- Handle ZodError (400), Unauthorized (401), and generic errors (500)
- CSRF protection handled by middleware (automatic)
- Rate limiting handled by middleware (automatic)
- Include file header with security notes
```

### Create a New Protected Page

```
Create a new protected page at /dashboard/settings that:
- Uses server-side authentication check
- Fetches user data server-side
- Displays a settings form (name, email, preferences)
- Uses DaisyUI components for styling
- Follows ShipSafe component patterns
```

### Create a New UI Component

```
Create a new reusable UI component called Alert.tsx in src/components/ui/:
- Accepts type prop (success, error, warning, info)
- Uses DaisyUI alert classes
- Supports children for content
- Includes close button functionality
- Follows ShipSafe component patterns (PascalCase, TypeScript, proper typing)
```

---

## 📝 Feature Development Prompts

### Add a New Feature Module

```
Create a new feature module for "notifications" following ShipSafe architecture:
1. Create src/features/notifications/ directory
2. Add server.ts with server-side notification logic
3. Add schema.ts with Zod validation schemas
4. Add types.ts with TypeScript interfaces
5. Create API route at /api/notifications/route.ts
6. Use requireAuth, Zod validation, and proper error handling
7. Follow ShipSafe security patterns (CSRF, rate limiting via middleware)
```

### Add Database Query

```
Add a Firestore query function in src/features/user/server.ts that:
- Fetches user document by UID
- Uses getFirestoreInstance() from @/lib/firebase/init
- Handles errors gracefully
- Returns typed User object
- Includes proper TypeScript types
```

### Add Form Component

```
Create a new form component in src/components/forms/ProfileForm.tsx:
- Uses DaisyUI form classes (input, btn, etc.)
- Handles form state with React hooks
- Validates input client-side
- Calls API route on submit
- Shows loading states
- Displays error messages
- Follows ShipSafe form patterns
```

---

## 🎨 UI/UX Prompts

### Create Landing Page Section

```
Create a new landing page section component in src/components/templates/ called Benefits.tsx:
- Displays 3-4 key benefits in a grid layout
- Uses DaisyUI card components
- Responsive design (mobile-first)
- Dark mode support
- Follows ShipSafe template component patterns
- Accepts benefits array as prop
```

### Style a Component

```
Update the Pricing component to:
- Use DaisyUI theme colors (primary, secondary)
- Add hover effects on pricing cards
- Make it fully responsive
- Add smooth transitions
- Ensure dark mode compatibility
- Follow TailwindCSS utility patterns
```

### Create Responsive Layout

```
Create a responsive dashboard layout that:
- Has sidebar navigation on desktop (hidden on mobile)
- Uses DaisyUI drawer component for mobile menu
- Maintains state across page navigations
- Includes user profile section
- Follows ShipSafe dashboard patterns
```

---

## 🔐 Security Prompts

### Add Authentication Check

```
Add authentication check to /api/user/update endpoint:
- Use requireAuth from @/lib/firebase/auth (automatically returns 401 for APIs)
- Verify user owns the resource being updated
- Return 401 if not authenticated (requireAuth handles this)
- Return 403 if user doesn't own resource
- Include proper error messages
- Follow ShipSafe v1.0 API route pattern (see .cursorrules)
```

### Add Webhook Endpoint

```
Create a new webhook endpoint at /api/webhooks/[provider]:
- Use raw request body (req.text() not req.json())
- Validate signature with provider SDK
- Exclude from CSRF protection (middleware handles this automatically)
- Update Firestore via Admin SDK
- Return 200 status quickly
- Handle errors gracefully (log but don't expose details)
- Follow ShipSafe webhook pattern (see docs/features/webhooks.md)
```

### Add Input Validation

```
Add Zod validation schema for user profile update in src/features/user/schema.ts:
- Validate name (string, min 2, max 50)
- Validate email (valid email format using z.email())
- Validate optional bio field (string, max 500)
- Export schema for use in API route
- Include helpful error messages
- Use .safeParse() in API route for better error handling
- Return detailed validation errors (400 status)
```

### Add Rate Limiting

```
Rate limiting is automatically handled by middleware (7-layer security architecture).
For /api/user/update endpoint:
- Document that rate limiting is automatic via middleware
- Rate limits are IP-based and configured in middleware
- Returns 429 status automatically if limit exceeded
- No additional code needed - middleware handles it
- See docs/security/rate-limiting.md for details
```

---

## 🧪 Testing & Debugging Prompts

### Debug API Route

```
Help me debug this API route issue:
[Paste your code]

The error is: [Describe error]
Expected behavior: [What should happen]
Current behavior: [What's happening]

Check for:
- Authentication issues
- Validation errors
- Firestore query problems
- Type mismatches
- Missing error handling
```

### Add Error Handling

```
Add comprehensive error handling to this API route:
[Paste your code]

Include:
- Zod validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Server errors (500)
- Proper error messages for each case
```

### Optimize Database Query

```
Optimize this Firestore query:
[Paste your code]

Consider:
- Adding indexes if needed
- Reducing data fetched
- Using pagination
- Caching strategies
- Error handling
- Type safety
```

---

## 📚 Documentation Prompts

### Document a Component

```
Add comprehensive documentation to this component:
[Paste your code]

Include:
- Component description
- Props interface with JSDoc
- Usage examples
- Styling notes (DaisyUI classes used)
- Accessibility considerations
- Follow ShipSafe documentation patterns
- Create docs/components/[category]/[component].md (not README.md)
- Use overview.md files in docs folders
```

### Document an API Route

```
Add documentation header to this API route:
[Paste your code]

Include:
- Route description
- Security notes
- Request/response formats
- Error codes
- Usage examples
- Follow ShipSafe API documentation patterns
```

---

## 🔄 Refactoring Prompts

### Move Logic to Features

```
Refactor this API route to follow ShipSafe architecture:
[Paste your code]

Move business logic to src/features/[domain]/server.ts
Keep API route thin (just validation and response)
Add proper TypeScript types
Include error handling
```

### Convert to Server Component

```
Convert this client component to a server component:
[Paste your code]

Remove "use client" directive
Move data fetching to server-side
Use async/await for data loading
Keep interactivity in separate client components if needed
```

### Extract Reusable Logic

```
Extract this repeated logic into a reusable function:
[Paste your code]

Create utility function in appropriate location:
- src/lib/ for generic utilities
- src/features/[domain]/ for domain-specific logic
- Include proper TypeScript types
- Add JSDoc documentation
```

---

## 🎯 Common Tasks

### Add Environment Variable

```
Add a new environment variable for [purpose]:
1. Add to .env.example with description
2. Use getEnv() helper from @/lib/security/env (not direct process.env access)
3. If client-side: Use NEXT_PUBLIC_ prefix
4. If server-only: No prefix (never exposed to client)
5. Document in docs/features/environment-variables.md
6. Use in [location] with getEnv("VARIABLE_NAME")
7. Include TypeScript type for the variable
8. Handle missing config gracefully (show helpful errors)
```

### Add New Stripe Plan

```
Add a new Stripe plan to config.ts:
- Add plan object with priceId, name, description
- Include in plans array
- Update TypeScript types
- Document in billing documentation
- Ensure webhook handlers support it
```

### Add Firebase Security Rule

```
Add Firestore security rule for [collection]:
- Allow authenticated users to read/write their own documents
- Use path-based security (users/{userId}/...)
- Include helper functions
- Test with Firebase emulator
- Document in firestore.rules comments
```

---

## 💡 Best Practices Prompts

### Review Code for Security

```
Review this code for security issues:
[Paste your code]

Check for:
- Input validation (Zod schemas)
- Authentication/authorization (requireAuth for APIs)
- Firestore query safety (path-based security)
- XSS vulnerabilities (sanitize user input)
- CSRF protection (middleware handles, but webhooks excluded)
- Rate limiting (middleware handles automatically)
- Error message leakage (don't expose internal details)
- Environment variable access (use getEnv() helper)
- Firebase config handling (graceful errors if not configured)
- Follow ShipSafe v1.0 security patterns (7-layer architecture)
```

### Optimize Performance

```
Optimize this code for performance:
[Paste your code]

Consider:
- Server vs client components
- Data fetching strategies
- Caching opportunities
- Bundle size
- Image optimization
- Code splitting
- Follow Next.js 15 best practices
```

### Improve TypeScript Types

```
Improve TypeScript types in this code:
[Paste your code]

Add:
- Proper interfaces for all data structures
- Type guards where needed
- Generic types for reusable functions
- Strict null checks
- Remove any types
- Add JSDoc type annotations
```

---

## 🚨 Troubleshooting Prompts

### Fix Build Error

```
Help me fix this build error:
[Paste error message]

The error occurs in: [File/component]
Context: [What you were trying to do]

Check for:
- TypeScript errors
- Import issues (use @/ alias, check paths)
- Missing dependencies
- Configuration problems (Next.js 16/Turbopack config)
- Firebase configuration (graceful handling if not set)
- Follow ShipSafe v1.0 patterns
```

### Fix Firebase Configuration Error

```
I'm getting a Firebase configuration error:
[Paste error message]

This is a boilerplate - Firebase may not be configured yet. Help me:
- Add graceful error handling
- Show helpful setup instructions
- Don't crash the app if Firebase isn't configured
- Point to docs/features/firebase-setup.md
- Use getEnv() helper for secure access
```

### Fix Runtime Error

```
Help me fix this runtime error:
[Paste error message]

The error occurs when: [Describe when it happens]
Expected behavior: [What should happen]

Check for:
- Async/await issues
- State management problems
- API route errors
- Firestore query issues
- Authentication problems
```

---

## 📖 Learning Prompts

### Explain ShipSafe Pattern

```
Explain how [feature/pattern] works in ShipSafe:
- Architecture decision
- Why it's structured this way
- How to use it
- Common pitfalls
- Best practices
- Examples from codebase
```

### Show Me Examples

```
Show me examples of [pattern/feature] in the ShipSafe codebase:
- Find similar implementations
- Show different use cases
- Explain variations
- Highlight best practices
- Point out what to avoid
```

---

## 🎨 Customization Prompts

### Customize Theme

```
Help me customize the DaisyUI theme:
- Update colors in config.ts
- Show me available theme options
- Explain color system
- Provide examples
- Ensure dark mode compatibility
```

### Add Custom Component

```
Create a custom component that:
- [Describe functionality]
- Uses DaisyUI base classes
- Follows ShipSafe patterns
- Includes TypeScript types
- Has proper documentation
- Is reusable and accessible
```

---

## 💬 Tips for Using These Prompts

1. **Be Specific**: Include relevant code snippets and context
2. **State Your Goal**: Clearly describe what you want to achieve
3. **Reference Patterns**: Mention specific ShipSafe patterns you want to follow
4. **Include Errors**: Paste error messages when troubleshooting
5. **Iterate**: Refine prompts based on Cursor's responses

---

## 🔗 Related Resources

- **[Cursor AI Workflow Documentation](./docs/extras/cursor-ai-workflow.md)** - Complete guide to using Cursor with ShipSafe
- **[.cursorrules](./.cursorrules)** - Cursor configuration file (v1.0 updated)
- **[ShipSafe Documentation](./docs/overview.md)** - Full documentation (80+ guides)
- **[Security Documentation](./docs/security/middleware.md)** - 7-layer security architecture
- **[API Routes Guide](./docs/features/api-routes.md)** - API route patterns
- **[Troubleshooting](./docs/extras/troubleshooting.md)** - Common issues and solutions

---

## 🎯 v1.0 Production-Tested Patterns

All prompts follow patterns validated in **ThinkMate.online** production deployment:

- ✅ **7-Layer Security** - Complete security stack
- ✅ **Webhook Exclusion** - CSRF protection excludes webhooks
- ✅ **API Route Auth** - 401 for APIs, redirects for pages
- ✅ **Graceful Errors** - Helpful messages for missing config
- ✅ **getEnv() Helper** - Secure environment variable access
- ✅ **Consistent Responses** - Standardized API response format

**Pro Tip**: Save your favorite prompts in Cursor's chat history or create your own prompt library!

