# Academics-Doctor

A full-featured academic study platform built with React, TypeScript, and Supabase.

## Features

- **Dashboard** – Overview of recent notes, research, and study activity
- **Notes** – Rich-text note editor with drawing canvas, math toolbar, and formula blocks
- **Research** – Save and organise research sources
- **My Work** – Track saved work and study sessions
- **Study Workspace** – Split-pane workspace combining notes, calculator, and formula library
- **Advanced Calculator** – Scientific calculator with history
- **Formula Library** – Create and browse mathematical formulas
- **Authentication** – Sign up, log in, and password reset via Supabase Auth
- **Themes** – Light/dark mode and personalisation

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### Setup

```bash
npm install
cp .env.example .env
# Fill in your Supabase URL and anon key in .env
```

Run the Supabase migration in `supabase/migrations/` to create the database tables, then:

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** (bundler)
- **React Router v7**
- **Supabase** (auth + database + storage)
- **CSS Modules**
