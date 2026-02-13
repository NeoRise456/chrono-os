# CHRONO_OS

A personal productivity app for habit tracking, task management, and weekly scheduling.

check it out at [https://chrono-os.neorise.cloud/](https://chrono-os.neorise.cloud/)

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

