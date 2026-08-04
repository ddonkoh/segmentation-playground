# Cursor AI Workflow

Complete guide to using Cursor AI and ChatGPT prompts to accelerate ShipSafe development.

## Overview

ShipSafe is designed to work seamlessly with AI-powered development tools like Cursor and ChatGPT. This guide covers:

- **Cursor Rules** - How `.cursorrules` helps AI understand ShipSafe architecture
- **ChatGPT Prompts** - Product development prompts (PRD generation, brand brainstorming)
- **Cursor Prompts** - Development workflow prompts (scaffolding, CSS generation, etc.)

---

## 🎯 Cursor Rules

### What are Cursor Rules?

The `.cursorrules` file in the ShipSafe root directory tells Cursor AI about your project's architecture, conventions, and requirements. When you use Cursor's AI features, it automatically reads this file to provide context-aware suggestions.

### Location

```
ShipSafe.st/
├── .cursorrules          ← Cursor AI configuration
├── cursor_prompts.md     ← Ready-to-use prompts library
├── src/
├── docs/
└── ...
```

### How It Works

1. **Automatic Context** - Cursor reads `.cursorrules` automatically when you use AI features
2. **Code Suggestions** - AI suggestions follow ShipSafe conventions
3. **Architecture Awareness** - AI understands folder structure and patterns
4. **Security Enforcement** - AI reminds you about security requirements

### Key Sections in `.cursorrules`

The ShipSafe `.cursorrules` file includes:

- **Project Overview** - Tech stack and philosophy
- **File Structure Rules** - Where files belong
- **Naming Conventions** - How to name files and components
- **Security Requirements** - Security patterns to follow
- **API Route Pattern** - Detailed API route structure with examples
- **UI/UX Rules** - Styling conventions and responsive design
- **React Component Conventions** - Server vs client components with examples
- **Code Documentation Standards** - File headers and JSDoc patterns
- **Learning Resources** - Reference files and documentation links

### Using Cursor Prompts

ShipSafe includes a comprehensive `cursor_prompts.md` file with ready-to-use prompts for common tasks:

- **Quick Start Prompts** - Create API routes, pages, components
- **Feature Development** - Add new features, database queries, forms
- **UI/UX Prompts** - Create landing sections, style components
- **Security Prompts** - Add authentication, validation, rate limiting
- **Testing & Debugging** - Debug issues, add error handling
- **Documentation** - Document components and API routes
- **Refactoring** - Move logic, convert components, extract utilities

**See `cursor_prompts.md` in the root directory for the complete prompt library.**

### Using Cursor with ShipSafe

#### 1. Open Cursor

```bash
# Install Cursor from cursor.sh
# Open ShipSafe project in Cursor
cd ShipSafe.st
cursor .
```

#### 2. Use AI Features

Cursor automatically uses `.cursorrules` when you:

- **Ask questions** - "How do I create a new API route?"
- **Generate code** - "Create a new protected page"
- **Refactor code** - "Move this to features/"
- **Fix errors** - AI understands ShipSafe patterns

#### 3. Use Ready-Made Prompts

Open `cursor_prompts.md` and copy prompts for:

- Creating new features
- Building UI components
- Adding security checks
- Debugging issues
- And much more!

**Example:**
```
Copy a prompt from cursor_prompts.md → Paste in Cursor chat → Get instant results
```

#### 4. Customize Rules

You can extend `.cursorrules` for your specific needs:

```markdown
## Custom Rules for My Project

- Always use TypeScript strict mode
- Prefer server components
- Use DaisyUI components
```

---

## 🤖 ChatGPT Prompts for Product Development

Use these prompts with ChatGPT (or Claude) to accelerate product development.

### Brand Brainstorming

**Prompt:**

```
I'm building a SaaS product using ShipSafe boilerplate. Help me brainstorm:

1. Product name ideas (should be memorable, brandable, .com available)
2. Tagline options (short, punchy, value-focused)
3. Brand personality (3-5 adjectives)
4. Color palette suggestions (2-3 primary colors)
5. Target audience description

Product concept: [Describe your product idea]

Constraints:
- Must work with ShipSafe's security-first branding
- Should differentiate from competitors
- Needs to appeal to [target market]
```

**Example:**

```
I'm building a SaaS product using ShipSafe boilerplate. Help me brainstorm:

1. Product name ideas (should be memorable, brandable, .com available)
2. Tagline options (short, punchy, value-focused)
3. Brand personality (3-5 adjectives)
4. Color palette suggestions (2-3 primary colors)
5. Target audience description

Product concept: A project management tool for remote teams with AI-powered task prioritization

Constraints:
- Must work with ShipSafe's security-first branding
- Should differentiate from competitors like Asana and Trello
- Needs to appeal to remote-first startups and agencies
```

### PRD Generation

**Prompt:**

```
Generate a Product Requirements Document (PRD) for my SaaS product. Use this format:

===============================================================
[Product Name] — Product Requirements Document (PRD)
===============================================================
Version: 1.0
Owner: [Your Name]
Last Updated: [Date]
Status: Draft

===============================================================
1. Executive Summary
===============================================================
[Brief overview of product, target users, key value proposition]

===============================================================
2. Problem Statement
===============================================================
[What problem does this solve? Who has this problem?]

===============================================================
3. Solution Overview
===============================================================
[How does the product solve the problem? Key features?]

===============================================================
4. Target Users
===============================================================
[Primary personas, use cases, pain points]

===============================================================
5. Core Features (MVP)
===============================================================
[Feature 1]
- Description
- User story
- Acceptance criteria

[Feature 2]
...

===============================================================
6. Technical Requirements
===============================================================
- Built on ShipSafe boilerplate (Next.js 15, Firebase, Stripe)
- Must support [specific requirements]
- Security: 7-layer security stack
- Performance: [target metrics]

===============================================================
7. Success Metrics
===============================================================
[How will we measure success?]

Product details:
[Describe your product idea in detail]
```

**Example:**

```
Generate a Product Requirements Document (PRD) for my SaaS product. Use this format:

[... PRD template ...]

Product details:
I'm building an AI-powered code review tool that helps developers catch bugs and security issues before deployment. It integrates with GitHub, analyzes pull requests, and provides actionable feedback. Target users are development teams at startups and mid-size companies.
```

### Feature Specification

**Prompt:**

```
Write a detailed feature specification for [Feature Name] in my ShipSafe-based SaaS product.

Include:
1. Feature overview and purpose
2. User stories (as a [user type], I want [goal] so that [benefit])
3. Technical requirements
4. API endpoints needed
5. Database schema changes
6. UI/UX mockup description
7. Acceptance criteria
8. Edge cases to handle

Product context: [Brief description]
Tech stack: Next.js 15, Firebase Auth, Firestore, Stripe
```

---

## 💻 Cursor Prompts for Development

Use these prompts directly in Cursor's AI chat to accelerate development.

### Project Scaffolding

**Prompt:**

```
Using @PRD.rst, let's begin scaffolding a dev_plan.rst for this project.

The dev_plan should include:
1. Phase breakdown (Foundation, Features, UI, Testing, Launch)
2. Dependencies between phases
3. Success criteria for each phase
4. Estimated timeline
5. Risk mitigation strategies

Reference ShipSafe.st architecture and patterns.
```

**Prompt:**

```
Based on @prd/prd.rst, create a development plan following ShipSafe patterns:

1. Break down features into phases
2. Identify dependencies
3. List required API routes
4. List required components
5. List required Firestore collections
6. Security considerations
7. Testing requirements

Format as dev_plan.rst following ShipSafe.st_Docs/dev/dev_plan.rst structure.
```

### Component Generation

**Prompt:**

```
Generate a [ComponentName] component for ShipSafe following these requirements:

- Location: src/components/[category]/[ComponentName].tsx
- Props: [list props]
- Styling: Use DaisyUI classes, TailwindCSS utilities
- Responsive: Mobile-first design
- Accessibility: ARIA labels, keyboard navigation
- Server/Client: [specify]

Requirements:
[Describe component functionality]

Reference existing ShipSafe components for patterns.
```

**Example:**

```
Generate a UserProfile component for ShipSafe following these requirements:

- Location: src/components/ui/UserProfile.tsx
- Props: { userId: string, showEmail?: boolean, showSubscription?: boolean }
- Styling: Use DaisyUI classes, TailwindCSS utilities
- Responsive: Mobile-first design
- Accessibility: ARIA labels, keyboard navigation
- Server/Client: Server component (fetch user data server-side)

Requirements:
- Display user avatar, name, email (optional)
- Show subscription status badge if showSubscription is true
- Link to /dashboard/account for editing
- Use Firestore to fetch user data
- Handle loading and error states
```

### CSS Generation

**Prompt:**

```
Generate CSS/Tailwind classes for a '[Topic] SaaS' landing page section.

Requirements:
- Topic: [Describe the section - e.g., "AI-powered analytics dashboard"]
- Style: Modern, professional, matches ShipSafe aesthetic
- Use DaisyUI theme colors
- Responsive design
- Include hover effects and transitions
- Follow ShipSafe component patterns

Generate:
1. Hero section styles
2. Features grid styles
3. CTA section styles
4. Any custom utility classes needed
```

**Example:**

```
Generate CSS/Tailwind classes for a 'Project Management SaaS' landing page section.

Requirements:
- Topic: Project management tool with kanban boards and team collaboration
- Style: Modern, professional, matches ShipSafe aesthetic
- Use DaisyUI theme colors
- Responsive design
- Include hover effects and transitions
- Follow ShipSafe component patterns

Generate:
1. Hero section styles
2. Features grid styles (kanban, collaboration, analytics)
3. CTA section styles
4. Any custom utility classes needed
```

### API Route Generation

**Prompt:**

```
Create a new API route following ShipSafe patterns:

Route: /api/[endpoint]/route.ts
Method: [GET/POST/PUT/DELETE]
Authentication: [Required/Optional]
Rate Limiting: [Yes/No]

Requirements:
- Use Zod for validation
- Use requireAuth from @/lib/firebase/auth
- Follow ShipSafe API route pattern
- Include error handling
- Return proper status codes

Functionality:
[Describe what the endpoint should do]
```

**Example:**

```
Create a new API route following ShipSafe patterns:

Route: /api/projects/route.ts
Method: POST
Authentication: Required
Rate Limiting: Yes

Requirements:
- Use Zod for validation
- Use requireAuth from @/lib/firebase/auth
- Follow ShipSafe API route pattern
- Include error handling
- Return proper status codes

Functionality:
Create a new project for the authenticated user. Request body: { name: string, description?: string }. Store in Firestore under users/{userId}/projects/{projectId}. Return created project data.
```

### Database Schema Design

**Prompt:**

```
Design a Firestore database schema for [Feature Name] in ShipSafe.

Requirements:
- Follow ShipSafe patterns (users/{userId}/[collection]/[docId])
- Include security rules considerations
- Optimize for common queries
- Include indexes needed

Feature: [Describe feature]
Collections needed: [List collections]
Relationships: [Describe relationships]
```

### Testing Prompts

**Prompt:**

```
Generate test cases for [Feature/Component/API Route] in ShipSafe.

Include:
1. Happy path tests
2. Error cases
3. Edge cases
4. Security tests
5. Performance considerations

Feature: [Describe feature]
```

---

## 📋 Workflow Examples

### Complete Feature Development

**Step 1: Generate PRD**
```
[Use ChatGPT PRD prompt]
```

**Step 2: Create Dev Plan**
```
In Cursor: "Using @PRD.rst, scaffold a dev_plan.rst following ShipSafe patterns"
```

**Step 3: Generate Components**
```
In Cursor: "Generate [ComponentName] component following ShipSafe patterns"
```

**Step 4: Generate API Routes**
```
In Cursor: "Create API route for [feature] following ShipSafe patterns"
```

**Step 5: Generate Styles**
```
In Cursor: "Generate CSS for [section] SaaS landing page"
```

### Quick Component Addition

**Step 1: Describe Component**
```
In Cursor: "I need a [ComponentName] that [does X]. Generate it following ShipSafe patterns."
```

**Step 2: Refine**
```
In Cursor: "Update [ComponentName] to also [do Y]"
```

**Step 3: Style**
```
In Cursor: "Make [ComponentName] match ShipSafe design system better"
```

---

## 🎨 Best Practices

### 1. Always Reference ShipSafe Patterns

When using AI prompts, always mention:
- "Following ShipSafe patterns"
- "Using ShipSafe architecture"
- "Reference ShipSafe components"

### 2. Use File References

In Cursor, use `@filename` to reference files:
- `@.cursorrules` - Project rules
- `@prd/prd.rst` - Product requirements
- `@src/components/ui/Button.tsx` - Example component

### 3. Iterate and Refine

AI suggestions are starting points. Always:
- Review generated code
- Test functionality
- Refine based on ShipSafe conventions
- Update `.cursorrules` if needed

### 4. Security First

Always remind AI about security:
- "Include input validation with Zod"
- "Use server-side authentication"
- "Follow ShipSafe security patterns"

---

## 🔗 Related Documentation

- **[Cursor Rules File](../../.cursorrules)** - Full `.cursorrules` file reference
- **[Project Structure](../get-started/project-structure)** - Understand ShipSafe architecture
- **[API Routes](../features/api-routes)** - API route patterns
- **[Components](../components/overview)** - Component patterns
- **[Configuration](../get-started/configuration)** - App configuration

---

## 💡 Tips

1. **Save Prompts** - Keep a file of your most-used prompts
2. **Customize Rules** - Extend `.cursorrules` for your project needs
3. **Reference Examples** - Point AI to existing ShipSafe code
4. **Iterate** - Use AI for first draft, refine manually
5. **Test Everything** - Always test AI-generated code

---

**Pro Tip:** Create a `prompts.md` file in your project root to store your custom prompts for easy reuse!

