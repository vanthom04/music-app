# Music App 🎵

A modern, full-stack music streaming and management application built with the latest web technologies, including **Next.js 15**, **React 19**, and **tRPC**.

## 🚀 Tech Stack

This project leverages a "bleeding-edge" stack focused on performance, type safety, and developer experience.

### Core

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router & Server Actions)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Library:** [React 19](https://react.dev/)
- **Build System:** Turbopack

### UI & Styling

- **Design System:** [shadcn/ui](https://ui.shadcn.com/)
- **Primitives:** [Radix UI](https://www.radix-ui.com/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/) & React Icons
- **Animations:** `tw-animate-css`
- **Notifications:** [Sonner](https://sonner.emilkowal.ski/)

### Backend & Data

- **API Layer:** [tRPC](https://trpc.io/) (v11) - End-to-end typesafe APIs
- **Database ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** [Better Auth](https://better-auth.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) & [TanStack Query](https://tanstack.com/query/latest)

### Utilities & Features

- **File Uploads:** [Uploadthing](https://uploadthing.com/) & [MegaJS](https://github.com/tonistiigi/megajs)
- **Audio Parsing:** `music-metadata`
- **Forms:** React Hook Form + Zod Validation
- **Emails:** React Email & Nodemailer

## 📂 Project Structure

```bash
.
├── prisma/              # Database schema and migrations
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js App Router pages
│   ├── components/      # Reusable UI components (shadcn/ui)
│   ├── generated/       # Generated types/code
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── modules/         # Feature-based modules
│   └── trpc/            # tRPC router and server definitions
├── .env                 # Environment variables
└── package.json
```

## 🛠️ Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- **Node.js:** v20 or higher (Required for Next.js 15/React 19)
- **Package Manager:** [Bun](https://bun.sh/) (Recommended based on lockfile) or npm/pnpm.

### 1\. Clone the repository

```bash
git clone [https://github.com/vanthom04/music-app.git](https://github.com/vanthom04/music-app.git)
cd music-app
```

### 2\. Install dependencies

```bash
bun install
# or
npm install
```

### 3\. Environment Variables

Create a `.env` file in the root directory. You will need to configure credentials for your database, authentication provider, and storage services.

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/music_app"

# Better Auth
BETTER_AUTH_SECRET="your_generated_secret"

GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"

# Uploadthing
UPLOADTHING_TOKEN="your_uploadthing_token"

# SMTP / Email
SMTP_SERVER_HOST="smtp.example.com"
SMTP_SERVER_USER="your_user"
SMTP_SERVER_PASS="your_password"

# Megajs
MEGA_EMAIL="your_mega_email"
MEGA_PASSWORD="your_mega_password"
MEGA_ROOT_FOLDER="root_folder"

NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_LRCLIB_URL="https://lrclib.net"
```

### 4\. Database Setup

Initialize the database schema using Prisma.

```bash
# Generate Prisma Client
bun run prisma generate

# Push migrations to the database
bun run db:dev
```

### 5\. Run the development server

Start the application with Turbopack enabled.

```bash
bun run dev
# or
npm run dev
```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result.

## 📜 Scripts

The following commands are available in `package.json`:

- **`dev`**: Starts the development server with `--turbopack`.
- **`build`**: Builds the application for production.
- **`start`**: Starts the production server.
- **`lint`**: Runs ESLint.
- **`db:dev`**: Runs `prisma migrate dev` to apply schema changes.
- **`db:studio`**: Opens Prisma Studio GUI to view/edit data.
- **`db:reset`**: Resets the database (Caution: deletes all data).

## 👤 Author

**vanthom04**

- GitHub: [@vanthom04](https://github.com/vanthom04)
- Email: vanthom2210@gmail.com

## 📄 License

This project is licensed under the **ISC License**.

---

_Happy Coding\! 🚀_
