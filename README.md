# Neo Life Planner

This project is a [Next.js](https://nextjs.org) application with [Convex](https://convex.dev) as the backend.

## Prerequisites

- Node.js
- pnpm

## Getting Started

1.  **Install dependencies:**

    ```bash
    pnpm install
    ```

2.  **Initialize Convex:**

    This will prompt you to log in to Convex and create a new project. It will also generate the necessary code in `convex/_generated`.

    ```bash
    npx convex dev
    ```

    Keep this running in a separate terminal window while developing.

3.  **Run the Next.js development server:**

    ```bash
    pnpm dev
    ```

4.  **Open the app:**

    Navigate to [http://localhost:3000](http://localhost:3000).

## Project Structure

- `app/`: Next.js App Router pages and components.
- `convex/`: Convex backend functions (queries, mutations, actions).
- `convex/_generated/`: Auto-generated Convex code (do not edit).

## Deployment

To deploy to production:

```bash
pnpm build
npx convex deploy
```
