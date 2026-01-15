# 🏋️ Nexus Fitness

A modern fitness tracking application built with Next.js and Supabase. Track workouts, nutrition, hydration, and progress in a sleek, dark-themed interface.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat-square&logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)

---

## ✨ Features

- **🏋️ Workout Tracking** - Log exercises with sets, reps, weight, and duration
- **🥗 Nutrition Logging** - Track meals and calories with a smart meal logger
- **💧 Hydration Monitoring** - Daily water intake tracking with visual progress
- **📊 Progress Dashboard** - View stats, trends, and achievements at a glance
- **📁 Workout Archive** - Save and revisit your favorite workout sessions
- **👤 User Profiles** - Personalized experience with BMR-based calorie goals
- **🌙 Dark Theme** - Premium glassmorphism UI with orange accents

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Taninwat-55/project2.git
   cd project2
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

4. **Run database migrations**
   
   Execute the SQL files in `supabase/migrations/` in order via Supabase SQL Editor.
   See [`supabase/README.md`](./supabase/README.md) for details.

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
project2-fitness/
├── frontend/                 # Next.js application
│   ├── app/
│   │   ├── (auth)/          # Authentication pages (login, signup)
│   │   ├── (main)/          # Protected pages (dashboard, workouts, etc.)
│   │   ├── actions/         # Server actions (API logic)
│   │   └── components/      # Reusable React components
│   ├── lib/                 # Utilities and schemas
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Supabase client helpers
│
└── supabase/                # Database
    ├── migrations/          # SQL migration files (numbered)
    └── README.md            # Migration documentation
```

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Database | [Supabase](https://supabase.com/) (PostgreSQL) |
| Auth | Supabase Auth |
| Styling | CSS Variables + Tailwind-inspired utilities |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| Validation | [Zod](https://zod.dev/) |

---

## 👥 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is for educational purposes.

---

<p align="center">
  Built with 💪 by <a href="https://github.com/Taninwat-55">Taninwat</a>
</p>
