# Boilerplate React Template`

A scalable, maintainable full-stack monorepo built for the Settlement Shopee application. This project uses `pnpm workspaces` to manage both the frontend and backend applications, along with shared packages for type definitions and utilities.

## 🏗️ Architecture & Tech Stack

This repository is structured as a monorepo using **pnpm workspaces**. It enforces strict typing across the stack using **TypeScript**.

### Frontend (`apps/frontend`)
A production-ready React application built with scalability and clean architecture in mind.
- **Framework:** React (Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **State Management:** Zustand (global state) + TanStack Query (server state)
- **Routing:** TanStack Router
- **Forms & Validation:** React Hook Form + Zod

### Backend (`apps/backend`)
A clean, scalable API built following SOLID principles and MVC architecture.
- **Framework:** Express.js + Node.js
- **Language:** TypeScript
- **Database:** MySQL2 (using raw queries, no ORM)
- **Validation:** Zod
- **File Uploads:** Multer
- **Architecture:** Controller → Service → Repository

### Packages (`packages/`)
- **`@setlement-shopee/types`**: Strictly typed shared data contracts (DTOs) used by both frontend and backend.
- **`@setlement-shopee/utils`**: Common utility functions shared across the workspace.

---

## 📂 Project Structure

```text
settlement-shopee/
├── apps/
│   ├── backend/          # Express.js API
│   └── frontend/         # React + Vite Web App
├── packages/
│   ├── shared-types/     # Shared TypeScript Definitions
│   └── shared-utils/     # Shared Utility Functions
├── package.json          # Root workspace configuration
├── pnpm-workspace.yaml   # pnpm workspace definition
└── tsconfig.base.json    # Base TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20+ recommended)
- [pnpm](https://pnpm.io/) (v9+)
- MySQL Server

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd settlement-shopee
   ```

2. Install dependencies across the entire workspace:
   ```bash
   pnpm install
   ```

### Running the Project

You can run both the frontend and backend simultaneously using the root scripts:

- **Start Development Servers (Frontend + Backend):**
  ```bash
  pnpm run dev
  ```

- **Build All Applications:**
  ```bash
  pnpm run build
  ```

- **Run Linting:**
  ```bash
  pnpm run lint
  ```

### Running Individual Apps

To run scripts for specific applications, use the `--filter` flag:

- **Frontend Only:**
  ```bash
  pnpm --filter @setlement-shopee/frontend dev
  ```

- **Backend Only:**
  ```bash
  pnpm --filter @setlement-shopee/backend dev
  ```

---

## 🛠️ Development Guidelines

### Consistent Naming
- Use **kebab-case** for all files and folders across the project.

### Shared Types
- When defining API request/response structures, place the types in `packages/shared-types`.
- This ensures the frontend and backend stay perfectly in sync without duplicating code.

### Backend Architecture
- **Controllers** should only handle HTTP requests and responses.
- **Services** contain all business logic.
- **Repositories** handle database interactions using strictly raw SQL queries (no ORM).

### Frontend Architecture
- Maintain a feature-based folder structure (e.g., `src/features/auth/`).
- Distinguish strictly between Server State (TanStack Query) and Global UI State (Zustand).
