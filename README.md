This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### 1. Configure Supabase env

Auth (login/signup and every portal) needs a Supabase backend. Copy the example
env and fill it in — **without these vars the gated routes return a 500**:

```bash
cp .env.example .env.local
# then edit .env.local with your Supabase URL + anon key
```

For a fully local backend, install the [Supabase CLI](https://supabase.com/docs/guides/local-development)
and run `supabase start`; it prints the API URL and anon key to paste into
`.env.local`, and applies the SQL in `supabase/migrations/` (auth schema,
RLS policies, the signup trigger, and the Data API grants).

### 2. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

> The **first** account to sign up becomes the `super_admin` (active); every
> later signup is a `tenant_admin` pending approval.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
