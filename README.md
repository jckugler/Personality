# Team Communication Map

A responsive Next.js app for team communication-style reflection. People enter their first name, last name, and email, complete an original 28-question workplace quiz once, then add their result to one or more open team maps.

This is not a clinical, psychological, or scientific assessment. It is a lightweight reflection tool for workplace conversations.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

The app works in local demo mode when `NEON_DATABASE_URL` is not configured. Local demo data stays in the same browser, so use Vercel Postgres/Neon mode for real team maps that need to work across devices.

## Current Flow

1. Person enters first name, last name, and email.
2. App checks whether that email already has a quiz result.
3. If no result exists, the person takes the quiz.
4. After the quiz, the person chooses an existing team map or creates a new one.
5. If a result already exists, the person can open maps they already joined or add their result to another open map.
6. Map pages ask for an email-linked URL and only show maps where that email has added a result. This is a product-level guard, not a replacement for real authentication.

## Vercel Database

Use a Postgres database through the Vercel Marketplace, such as Neon.

1. Open the Vercel project.
2. Go to Storage or Marketplace.
3. Add a Neon Postgres database.
4. Connect it to this project.
5. Confirm Vercel has a `NEON_DATABASE_URL` environment variable.
6. Redeploy.

The app creates these tables automatically when it first talks to the database:

- `teams`
- `participants`
- `responses`

## Communication Tips

The map includes built-in hover tips. When a person hovers over a name on the map, the app compares the viewer's primary color with that person's primary color and shows practical communication reminders for that pairing.
