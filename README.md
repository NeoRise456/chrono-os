# CHRONO_OS

A personal productivity app for habit tracking, task management, and weekly scheduling.

check it out at: [https://chrono-os.neorise.cloud/](https://chrono-os.neorise.cloud/)

## Why I Built This

I wasn't satisfied with existing habit trackers, their implementations were paid so I built my own lmao.

This started as a side project while I was working on something else. In just two weeks, I had a functional site. I'm actively using it to manage my life now.

I also used this project to practice articulating my ideas to AI. With the help of Vibe Kanban and OpenCode, nearly all of the UI was AI generated letting me focus on shaping the product rather than writing boilerplate.


> *the era of personal softwre some people say*
> * neo (like im sayin it uk [pls shut up] )

## Features

### Habit Tracking
- Create, edit, archive, and delete habits
- Custom colors, icons, and default durations
- Daily completion logging with counter support
- Reorder habits via drag-and-drop

### Statistics & Analytics
- **Streaks** — Current and best streaks with a weekly "shield" mechanic: miss one day per week without breaking your streak
- **Consistency Rate** — Track completion percentage over time
- **Daily Volume** — See how many habits you completed each day
- **Focus Trend** — Weekly progress visualization
- **Density Map** — GitHub-style activity heatmap

### Task Management
- **Inbox** — One-off tasks with due dates, tags, and priorities
- **Routines** — Recurring tasks (daily/weekly/monthly) that auto-reset

### Weekly Schedule
- Drag-and-drop habit scheduling on a weekly timetable
- Visual time blocks for planned activities
- Duplicate schedule cards across days

### Authentication
- GitHub OAuth via Better Auth

## Tech Stack

| Technology | Why |
|------------|-----|
| **Next.js 16** | App Router with SSR, excellent DX for full-stack React |
| **Convex** | Real-time reactive backend with zero infrastructure management |
| **Better Auth** | Simple, type-safe authentication with GitHub OAuth |
| **React 19 + TypeScript** | Latest React features with full type safety |
| **Tailwind CSS 4 + Radix UI** | Utility-first styling with accessible primitives |
| **Recharts** | Composable charts for habit statistics |
| **Vibe Kanban + OpenCode** | AI-assisted development (Opus 4.5, GLM-5, GLM-4.7) — generated nearly all UI code |

## Architecture

```
chrono-os/
├── app/                      # Next.js App Router
│   ├── (protected)/          # Auth-required routes
│   │   ├── habits/           # Habit tracking
│   │   ├── schedule/         # Weekly timetable
│   │   ├── todos/            # Task management
│   │   └── profile/          # User profile
│   ├── login/                # Authentication
│   └── api/auth/             # Better Auth routes
├── components/
│   ├── ui/                   # Radix-based UI primitives
│   ├── habits/               # Habit feature components
│   ├── chrono/               # Schedule feature components
│   └── todo/                 # Task feature components
├── convex/                   # Convex backend
│   ├── schema.ts             # Database schema
│   ├── habits.ts             # Habit CRUD
│   ├── habitLogs.ts          # Habit logging
│   ├── habitStats.ts         # Statistics queries
│   ├── tasks.ts              # Task CRUD
│   └── scheduleCards.ts      # Schedule CRUD
└── lib/                      # Utilities & auth config
```

**Data Flow:**

```
React Component → Convex Query/Mutation → Real-time Sync → UI Update
```

## Getting Started

### Prerequisites

- Node.js
- pnpm
- docker

### Installation

#### Installation of the convex databse

1.  Start the Infrastructure
    Spin up the Backend, Dashboard, and PostgreSQL database using the included compose file:

    ```bash
    docker compose -f selfhostconvex-docker-compose.yaml up -d
    ```

2.  Generate Admin Key
    You must generate an admin key to authenticate the CLI with your self-hosted instance. Run the generation script inside the backend container:

    ```bash
    docker compose -f selfhostconvex-docker-compose.yaml exec backend ./generate_admin_key.sh
    ```
    *> Copy the key output by this command (e.g., `sk_...`).*

3.  Configure Project Environment
    Update your `.env.local` file to point your app and the Convex CLI to your local instance instead of the cloud:

    ```bash
    
    
    # Connection to the self-hosted backend
    CONVEX_SELF_HOSTED_URL=http://127.0.0.1:3210
    
    # The key you generated in Step 2
    CONVEX_SELF_HOSTED_ADMIN_KEY=sk_your_generated_key_here
    
    # Public URL for your frontend to connect
    NEXT_PUBLIC_CONVEX_URL=http://127.0.0.1:3210

    # Public URL for your frontend to connect
    NEXT_PUBLIC_CONVEX_SITE_URL=http://127.0.0.1:3211

    # Public URL for your frontend to 
    NEXT_PUBLIC_SITE_URL=http://localhost:3000
    
    ```
4. Initialize Convex in project:

   ```bash
   npx convex dev
   ```
   
5.  Configure Convex Environment
    You must run the following commands to setup your convex database (setting up better auth plugin)

    Refer to the convex + better auth docs: [https://labs.convex.dev/better-auth/framework-guides/next](https://labs.convex.dev/better-auth/framework-guides/next)

    ```bash
    npx convex env set BETTER_AUTH_SECRET=$(openssl rand -base64 32)
    npx convex env set SITE_URL http://localhost:3000
    ```

##### Accessing Services

-   **Dashboard**: Visit http://localhost:6791 to manage your data and functions.
-   **Backend API**: Listening at http://127.0.0.1:3210.
-   **Database**: PostgreSQL is available on port `5432` .

#### Installation of the nextjs project

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Initialize Convex (prompts login and creates project):

   ```bash
   npx convex dev
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

5. Open http://localhost:3000

## Production Deployment

This app is deployed on a **Hostinger VPS** using **[Dokploy](https://dokploy.com/)**. Convex is self-hosted rather than using the cloud offering.

### Architecture

```
neorise.cloud
├── chrono-os.neorise.cloud           → Next.js app (port 3000)
├── convex-backend-main.neorise.cloud → Convex Cloud API (port 3210)
└── convex-backend-alt.neorise.cloud  → Convex Site/HTTP Actions (port 3211)
```

### Self-Hosted Convex Backend

#### 1. Create Compose Project in Dokploy

Create a new **Compose** project and paste the contents of `selfhostconvex-docker-compose.yaml`.

#### 2. Configure Environment Variables

Go to the **Environment** tab and add:

**Required:**
```
INSTANCE_SECRET=<generate with: openssl rand -hex 32>
```

**URLs — Option A: Dokploy's Free Traefik Domains (Quick Start)**
```
CONVEX_CLOUD_ORIGIN=http://shhosted-convex-cf33fb-<your-ip>.traefik.me
CONVEX_SITE_ORIGIN=http://shhosted-convex-59a34c-<your-ip>.traefik.me
NEXT_PUBLIC_DEPLOYMENT_URL=http://shhosted-convex-cf33fb-<your-ip>.traefik.me
```

**URLs — Option B: Custom Domain (Production)**
```
CONVEX_CLOUD_ORIGIN=https://convex-backend-main.neorise.cloud
CONVEX_SITE_ORIGIN=https://convex-backend-alt.neorise.cloud
NEXT_PUBLIC_DEPLOYMENT_URL=https://convex-backend-main.neorise.cloud
```

**PostgreSQL (leave empty for SQLite):**
```
DB_PASSWORD=your-strong-password
POSTGRES_URL=postgresql://postgres:your-strong-password@postgres:5432
```

#### 3. Configure Domains in Dokploy

Go to the **Domains** tab and add:
- `convex-backend-main.neorise.cloud` → Port `3210`
- `convex-backend-alt.neorise.cloud` → Port `3211`

Dokploy's Traefik will automatically provision SSL certificates.

#### 4. Deploy and Generate Admin Key

1. Click **Deploy** and wait for services to start
2. Once healthy, click **Terminal** on the backend container
3. Run:
   ```bash
   cd convex
   ./generate_admin_key.sh
   ```
4. Save the admin key securely — you'll need it for the Next.js app

#### 5. Set Convex Environment Variables

Using the Convex CLI (or Dashboard), set these in your deployment:

```bash
npx convex env set BETTER_AUTH_SECRET <generate with: openssl rand -base64 32>
npx convex env set SITE_URL https://chrono-os.neorise.cloud
npx convex env set GITHUB_CLIENT_ID <your-github-oauth-client-id>
npx convex env set GITHUB_CLIENT_SECRET <your-github-oauth-client-secret>
```

### Next.js App

#### 1. Create Application in Dokploy

Create a new **Application** → **Deploy from Git** or use the repository.

#### 2. Configure Build

Dokploy will automatically detect and use the `Dockerfile`.

#### 3. Configure Environment Variables

```
CONVEX_SELF_HOSTED_URL=https://convex-backend-main.neorise.cloud
CONVEX_SELF_HOSTED_ADMIN_KEY=<admin-key-from-step-4>
NEXT_PUBLIC_CONVEX_URL=https://convex-backend-main.neorise.cloud
NEXT_PUBLIC_CONVEX_SITE_URL=https://convex-backend-alt.neorise.cloud
NEXT_PUBLIC_SITE_URL=https://chrono-os.neorise.cloud
```

#### 4. Configure Domain

Add domain: `chrono-os.neorise.cloud`

#### 5. Deploy

Click **Deploy** — Dokploy will build and run the container.


