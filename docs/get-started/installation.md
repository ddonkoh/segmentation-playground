# Installation & Setup

Get ShipSafe running on your local machine in minutes.

## Prerequisites

Before you begin, make sure you have:

- **Node.js** 18.17 or greater ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager (comes with Node.js)
- **Git** installed ([Download](https://git-scm.com/))
- A code editor (VS Code/Cursor recommended)
  - **Cursor** is highly recommended for AI-assisted development (see [Cursor AI Workflow](../extras/cursor-ai-workflow))
  - ShipSafe includes `.cursorrules` for automatic AI context

**Verify your setup:**

```bash
node --version  # Should be v18.17+
npm --version   # Should be 9+
git --version   # Should be installed
```

## Installation Steps

### 1. Clone the Repository

Clone the ShipSafe repository to your local machine:

```bash
git clone https://github.com/Kostek02/shipsafe.st.git
cd shipsafe.st
```

**Note:** Replace `Kostek02` with your GitHub username if you've forked the repository.

### 2. Install Dependencies

Install all required npm packages:

```bash
npm install
```

This will install all dependencies listed in `package.json`, including:
- Next.js 15
- React
- TypeScript
- TailwindCSS
- DaisyUI
- Firebase SDK
- Stripe SDK
- And more...

**Installation time:** Usually takes 1-3 minutes depending on your internet connection.

### 3. Set Up Environment Variables

Environment variables are used to store sensitive configuration like API keys and database URLs.

**Step 1:** Copy the example environment file:

```bash
cp .env.example .env.local
```

**Step 2:** Open `.env.local` in your code editor and fill in your values:

```bash
# Firebase Configuration
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
# ... more variables
```

**Important:** Never commit `.env.local` to Git. It's already in `.gitignore`.

See the [Environment Variables Guide](../features/environment-variables) for detailed instructions on each variable.

### 4. Run Development Server

Start the Next.js development server:

```bash
npm run dev
```

You should see:

```
  ▲ Next.js 15.x.x
  - Local:        http://localhost:3000
  - Ready in 2.5s
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see your app.

**Development server features:**
- Hot module replacement (instant updates on save)
- Error overlay in browser
- Fast refresh for React components

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
# Use a different port
npm run dev -- -p 3001
```

### Installation Errors

If `npm install` fails:

1. **Clear npm cache:**
   ```bash
   npm cache clean --force
   ```

2. **Delete node_modules and reinstall:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check Node.js version:**
   ```bash
   node --version  # Must be 18.17+
   ```

### Environment Variables Not Loading

Make sure:
- File is named exactly `.env.local` (not `.env` or `.env.example`)
- File is in the root directory (same folder as `package.json`)
- Restart the development server after changing variables

## Next Steps

Now that ShipSafe is running locally:

1. **[First Steps](./first-steps)** - Learn the basics of the boilerplate
2. **[Project Structure](./project-structure)** - Understand the folder structure
3. **[Configuration](./configuration)** - Customize `config.ts`
4. **[Firebase Setup](../features/firebase-setup)** - Configure Firebase
5. **[Stripe Setup](../features/stripe-setup)** - Configure Stripe payments

## Common Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types
```

## Getting Help

- Check the [Troubleshooting Guide](../extras/troubleshooting)
- Review [Component Documentation](../components/overview)
- See [Tutorials](../tutorials/overview) for step-by-step guides

