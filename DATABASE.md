# Database guide

This is for whoever is working on `prisma/schema.prisma` and the data layer. You should already have the `.env.local` values (`DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `DIRECT_URL`, `NEON_AUTH_*`). If you don't, ask before doing anything below, the app and migrations won't work without them.

## Stack

- **Database**: Postgres, hosted on Neon.
- **ORM**: Prisma 7, using the `@prisma/adapter-neon` driver adapter (queries go over WebSocket, not a raw TCP connection).
- **Auth**: Neon Auth owns its own user table outside of Prisma. We never model or migrate that table. Our `Profile` model links to it via a plain `authUserId` string field (no foreign key), see `lib/db/profile.ts`.

Key files:

- `prisma/schema.prisma`, the schema. This is what you'll be editing.
- `prisma.config.ts`, connection config for the Prisma CLI (reads `DIRECT_URL`).
- `lib/db/client.ts`, the app's Prisma client singleton (reads `DATABASE_URL`, the pooled connection).
- `prisma/seed.ts`, demo data seed script.
- `prisma/migrations/`, migration history. Generated, don't hand-edit.

## The two connection strings, and why there are two

- `DATABASE_URL` (pooled), what the running app uses for normal queries.
- `DIRECT_URL` (unpooled), what the Prisma CLI uses for migrations. Migrations need a direct connection, they can't go through the connection pooler.

Both are already in `.env.local`. You shouldn't need to touch either unless Neon credentials rotate.

## The workflow for changing the schema

1. Edit `prisma/schema.prisma`.
2. Run:

   ```bash
   npx prisma migrate dev --name describe_your_change
   ```

   Pick a short, descriptive name (`add_produce_listing`, `add_bio_to_profile`, not `update` or `fix`). This generates a new folder under `prisma/migrations/` with the SQL for your change, applies it to the dev database, and regenerates the Prisma Client.

3. Commit `prisma/schema.prisma` **and** the new migration folder together. They're one change, not two.
4. If your change affects the seed data (e.g. you added a required field), update `prisma/seed.ts` to match, then run `pnpm db:seed` to confirm it still works.

**Do not use `prisma db push`.** It syncs the schema straight to the database without creating a migration file, so there's no history and no way for anyone else (or CI, or production) to reproduce the change. If you use it, even by accident, the dev database drifts from migration history and the next real migration will fail until someone resets the database. `migrate dev` is the only sanctioned way to change the schema here.

## Branch and PR workflow

Nothing gets committed straight to `main`, work happens on a branch and lands via a PR.

1. Branch off `main`:

   ```bash
   git checkout main
   git pull
   git checkout -b db/add-produce-listing
   ```

   Prefix with `db/` so it's obvious at a glance what the branch touches, then a short description of the change.

2. Make your schema change and generate the migration as described above.
3. Commit `prisma/schema.prisma` and the new `prisma/migrations/<timestamp>_<name>/` folder together, plus `prisma/seed.ts` if you updated it.
4. Push and open a PR:

   ```bash
   git push -u origin db/add-produce-listing
   gh pr create --title "db: add ProduceListing model" --body "What changed and why, plus how you tested it (ran migrate dev locally, reseeded, checked prisma studio)."
   ```

   (Or open the PR from GitHub's UI if you don't have `gh` set up, same idea.)

5. Before asking for review, make sure these pass locally, CI runs the same checks on every PR (`.github/workflows/ci.yml`):

   ```bash
   pnpm lint
   pnpm typecheck
   pnpm format:check
   ```

6. Wait for review rather than merging your own PR. CI doesn't have database credentials, it only checks lint/types/formatting, it does not apply your migration anywhere. The migration only runs against the shared dev database when someone actually runs `prisma migrate dev` with it, so flag in the PR description if there's anything about the change reviewers should know before doing that.

## Commands reference

```bash
pnpm db:generate   # regenerate the Prisma Client after pulling schema changes from git
pnpm db:studio     # open Prisma Studio (visual DB browser) at localhost:5555
pnpm db:seed       # run prisma/seed.ts (idempotent, safe to re-run)
```

`pnpm install` also runs `prisma generate` automatically via `postinstall`, so after pulling changes you usually just need `pnpm install` for the client to catch up. Run `pnpm db:generate` directly if you didn't reinstall but the schema changed under you (e.g. after `git pull` or switching branches).

## Conventions

- Model names: `PascalCase`, singular (`Profile`, not `Profiles`).
- Field names: `camelCase`.
- Enum values: `UPPER_SNAKE_CASE`.
- Add `@@index([...])` for any field combination you expect to filter or sort by. Look at how `Profile` does `@@index([district])` as an example.
- Prefer a required field over an optional one unless the data is genuinely sometimes absent. Don't make something nullable just to avoid a migration decision, that's a discussion, not a default.
- IDs are `String @id @default(cuid())` everywhere, keep that consistent.

## Current schema (as of this writing)

- `Role` enum: `FARMER`, `BUYER`. Modeled as an array on `Profile.roles` (a person can be both), but in practice only farmers sign up right now, there are no buyer accounts yet.
- `District` enum: all 30 Rwanda districts. The app is Rwanda-only for now, there's no `Country` model, don't add one unless a second country's data source is actually being integrated.
- `Profile`: the only model right now. Links to a Neon Auth user via `authUserId`, plus `email`, `firstName`, `lastName?`, `roles`, `district`, `phone`, `whatsapp?`, `bio?`.

Next model coming is `ProduceListing` (crop, quantity, unit, condition, price, district, status, linked to a `Profile` as the farmer). If you're picking that up, ask for the current plan doc rather than guessing the shape.

## Troubleshooting

- **`Error: P1001: Can't reach database server`, but the database is clearly up (e.g. `psql` connects fine)**: this is a slow-connection issue, not a real outage, we've hit it in some environments. Add `&connect_timeout=30` to the end of `DIRECT_URL` in `.env.local` and retry.
- **TypeScript complains a field doesn't exist that you just added to the schema**: the generated client is stale. Run `pnpm db:generate`.
- **`prisma migrate dev` says there's drift / wants to reset the database**: stop and ask before running `prisma migrate reset`, it drops all data in the dev database. This should only happen if someone used `db push` at some point, don't let it happen again by following the workflow above.

## What not to touch without asking first

- `prisma.config.ts` and `lib/db/client.ts`, these are the connection plumbing, changes here affect the whole app, not just your schema change.
- Files inside `prisma/migrations/` that have already been committed. If a migration was wrong, write a new migration to fix it forward, don't edit history.
