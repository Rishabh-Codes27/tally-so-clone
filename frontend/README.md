# Tally.so Clone Frontend

Next.js 16 + TypeScript form builder frontend with Tally.so-inspired design.

## Features

- **Form Builder**: Doc-style form creation with slash commands and keyboard shortcuts
- **User Authentication**: Sign up/sign in with JWT tokens
- **Anonymous Creation**: Create and publish forms without signing in
- **Block Types**: 20+ field types including text, multiple choice, email, file upload, payment, etc.
- **Live Preview**: Toggle between edit and preview modes
- **Form Sharing**: Generate shareable links for published forms
- **Response Collection**: View submissions with question labels
- **Form Management**: List and delete your forms (when signed in)

## Project Structure

```
frontend/
├── app/
│   ├── page.tsx                    # Marketing home page
│   ├── builder/page.tsx            # Form builder start screen
│   ├── forms/page.tsx              # List of user's forms
│   ├── signin/page.tsx             # Sign in page
│   ├── signup/page.tsx             # Sign up page
│   ├── s/[shareId]/page.tsx        # Public form viewer
│   └── responses/[formId]/page.tsx # Form responses viewer
├── components/
│   ├── form-builder/               # Form builder components
│   │   ├── form-builder.tsx        # Main builder with drag-drop
│   │   ├── form-block.tsx          # Individual block editor
│   │   ├── navbar.tsx              # Builder navbar with auth
│   │   ├── form-preview.tsx        # Preview mode renderer
│   │   ├── insert-block-dialog.tsx # Block picker with preview
│   │   ├── slash-command-menu.tsx  # Slash command menu
│   │   └── types.ts                # Block type definitions
│   ├── public-form/                # Public form components
│   │   ├── public-form.tsx         # Form container
│   │   ├── public-form-fields.tsx  # Field renderers
│   │   ├── labels.ts               # Field label helpers
│   │   └── types.ts                # Type definitions
│   └── ui/                         # Radix UI components
└── lib/
    └── api.ts                      # API client with auth

```

## Quick Start

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Set up environment variables:

   ```bash
   # .env.local
   NEXT_PUBLIC_API_BASE=http://127.0.0.1:8000
   ```

3. Run the development server:
   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Routes

### Public Routes

- `/` - Marketing home page with "Try for free" CTA
- `/signin` - Sign in with username/password
- `/signup` - Create a new account
- `/s/[shareId]` - View and submit public forms (no auth required)

### Protected Routes (require sign-in for full functionality)

- `/builder` - Form builder with start screen
- `/forms` - List all your forms with delete option
- `/responses/[formId]` - View form submissions with question labels

## Form Builder Features

### Keyboard Shortcuts

- **Enter** in title → Focus first form block
- **Enter** in block → Add new block below
- **Backspace** on empty text block → Delete block
- **/** → Open slash command menu
- **+** icon → Open insert block dialog

### Block Types

- **Input Fields**: Text, Email, Phone, URL, Number, Date, Time
- **Choices**: Multiple Choice, Checkboxes, Dropdown, Multi-select, Ranking
- **Advanced**: File Upload, Matrix, Signature, Rating, Linear Scale, Opinion Scale
- **Integrations**: Payment, Calendly

### UI Features

- Hover-only title options (Add logo, Add cover, Customize)
- Drag-and-drop block reordering
- Live preview toggle
- Copy shareable link with toast notification
- Form ownership tracking (when signed in)

## Authentication Flow

1. **Anonymous Mode**: Users can create and publish forms without signing in
2. **Sign Up**: Create account → auto-login → forms linked to user ID
3. **Sign In**: Login → JWT stored in localStorage → protected endpoints accessible
4. **Sign Out**: Clear token → redirect to home

## API Integration

The frontend communicates with the FastAPI backend via `lib/api.ts`:

```typescript
// Auth
login(username, password); // POST /auth/login
register(username, password); // POST /auth/register

// Forms
createForm(payload); // POST /forms (with optional auth)
listForms(); // GET /forms (requires auth)
getFormById(formId); // GET /forms/{id} (requires auth)
deleteForm(formId); // DELETE /forms/{id} (requires auth)

// Public
getFormByShareId(shareId); // GET /s/{shareId}
submitForm(shareId, data); // POST /s/{shareId}/submissions

// Responses
listFormSubmissions(formId); // GET /forms/{id}/submissions (requires auth)
```

## Styling

- **Framework**: Tailwind CSS with custom design tokens
- **Components**: Radix UI primitives
- **Font**: Space Grotesk for headings
- **Icons**: Lucide React
- **Theme**: Light mode with Tally.so-inspired color palette

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Set root directory to `frontend`
4. Add environment variable:
   ```
   NEXT_PUBLIC_API_BASE=https://your-railway-backend.up.railway.app
   ```
5. Deploy

### Build Locally

```bash
pnpm build
pnpm start
```

## Environment Variables

- `NEXT_PUBLIC_API_BASE` - Backend API URL (defaults to http://127.0.0.1:8000)

## Demo Account

For testing, use the seeded backend account:

- **Username**: `test-user`
- **Password**: `test-user`

Or create your own via `/signup`.
