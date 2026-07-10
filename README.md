# Lumina Planner

A polished notes + planner website built with:

- React + Vite
- Supabase database
- Supabase Google authentication
- Framer Motion animations
- Responsive desktop and mobile UI

There is no custom backend server. The browser talks directly to Supabase, protected by Row Level Security.

## Features

- Google sign-in
- Animated overview dashboard
- Monthly calendar
- Create and delete events
- Notes library with autosave
- Search notes and events
- Focus timer
- Responsive sidebar
- Demo mode when Supabase keys are not configured

## 1. Install

```bash
npm install
```

## 2. Create a Supabase project

1. Open Supabase and create a project.
2. Open **SQL Editor**.
3. Paste the contents of `supabase/schema.sql`.
4. Run the SQL.

## 3. Enable Google login

Inside Supabase:

1. Go to **Authentication → Providers → Google**.
2. Enable Google.
3. Create OAuth credentials in Google Cloud Console.
4. Add the Supabase callback URL shown in the Google provider setup.
5. Add these allowed redirect URLs in Supabase:
   - `http://localhost:5173`
   - Your deployed website URL

## 4. Add environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then fill in:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

You can find both under **Supabase → Project Settings → API**.

## 5. Run locally

```bash
npm run dev
```

Open the local URL printed by Vite.

## 6. Deploy

### Vercel

1. Push this folder to GitHub.
2. Import the repository into Vercel.
3. Add the two environment variables.
4. Set build command to `npm run build`.
5. Set output directory to `dist`.
6. Deploy.
7. Add the final Vercel URL to Supabase Authentication redirect URLs.

### Netlify

1. Push to GitHub.
2. Import into Netlify.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add the two environment variables.
6. Add the deployed URL to Supabase Authentication redirect URLs.

## Important security note

Never put the Supabase service-role key in this project. Only use the public anon key. The included SQL enables Row Level Security so each signed-in user can only access their own notes and events.
