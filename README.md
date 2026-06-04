# Team Communication Map

A responsive Next.js app for team communication-style reflection. People enter their first name, last name, and email, complete an original 28-question workplace quiz once, then add their result to one or more open team maps.

This is not a clinical, psychological, or scientific assessment. It is a lightweight reflection tool for workplace conversations.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

The app works in local demo mode when Supabase variables are not configured. Local demo data stays in the same browser, so use Supabase mode for real team maps that need to work across devices. Add the values from `.env.example` to use Supabase.

## Current Flow

1. Person enters first name, last name, and email.
2. App checks whether that email already has a quiz result.
3. If no result exists, the person takes the quiz.
4. After the quiz, the person chooses an existing team map or creates a new one.
5. If a result already exists, the person can open maps they already joined or add their result to another open map.
6. Map pages ask for an email-linked URL and only show maps where that email has added a result. This is a product-level guard, not a replacement for real authentication.

## Supabase

Run `supabase/schema.sql` in your Supabase SQL editor. The app expects:

- `teams`
- `participants`
- `responses`

For production, configure Supabase Auth and Row Level Security policies for your organization before sharing dashboard links broadly. The included schema is intentionally simple so the app can be wired up quickly, and the local demo mode is not an access-control system.

## Communication Tips

The map includes built-in hover tips. When a person hovers over a name on the map, the app compares the viewer's primary color with that person's primary color and shows practical communication reminders for that pairing.
