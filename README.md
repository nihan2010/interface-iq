# Interface IQ ⚡

> **Interface IQ** — Upload any UI screenshot and get instant AI-powered scores on hierarchy, spacing, contrast & accessibility. Post your designs to the Arena, rate others, and leave improvement suggestions. Built for designers who want real feedback. 🚀

## ✨ Features

- 🤖 **AI-Powered Analysis** — Gemini AI scores your UI on 8 metrics including hierarchy, contrast, spacing, and accessibility
- ⚔️ **UI Arena** — Community feed where designers post and rate each other's work
- 💬 **Suggestion Box** — Leave 1–10 ratings with written critiques on any design
- 👑 **God Mode Admin** — Secure admin dashboard for platform moderation
- 🌙 **Dark/Light Theme** — Premium glassmorphic design system

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Database | Supabase PostgreSQL |
| ORM | Prisma v7 (Driver Adapters) |
| Auth | Clerk v7 |
| AI | Google Gemini |
| Styling | Tailwind CSS |
| Animations | Framer Motion |

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your Supabase, Clerk, and Gemini API keys

# Push the database schema
npx prisma db push

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 🔐 Environment Variables

Create a `.env` file in the root:

```env
DATABASE_URL=your_supabase_pooler_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
GEMINI_API_KEY=your_gemini_key
```

## 👤 Author

**Nihan Najeeb** — [nihanajeeb.in](https://nihanajeeb.in) · Made from Kerala with ❤️
