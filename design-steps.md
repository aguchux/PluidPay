# Design Stack and Steps

## 1. Scaffold Nextjs

1. The first thing I did was to scaffold Nextjs app with tailwindCSS.
2. Linting setup
3. Prettier setup (clean code is important)
4. .vscode helper settings - to help us automate onSave, etc...

## 2. Setup Testing (Jest & Supertest)

1. Setup Jest and supertest (unit testing)
2. Run test to ensure all is working
3. Setup and test code coverage test

## 3. Setup RTQ Query and Redux State

1. Setup Redux Toolkit
2. RTQ API System and wire all up with store
3. Setup persist state

### Key Features

Declarative API endpoints: Define how to fetch, mutate, and cache data.
Auto caching & invalidation: RTK Query keeps track of cached data and refetches when needed.
Integrated loading/error states: Easily track request status in your UI.
Automatic updates: When you mutate data (e.g., POST, PUT), relevant queries automatically refetch or update.
No need for manual thunk or reducer creation: RTK Query generates everything for you.

## 4. Setup Prisma DB for Postgres

1. Setup Prisma ORM
2. Setup Docker and spinup postgres [pluidDb and pluidShadowDb]
3. Create Model Schemas

## 5. Created a small CorelDraw graphics

1. Created Pluid Logo
2. Banners and assets

## 6. App Theme (I decided to integrate themes [light and dark])

1. Scaffold 'next-themes'
2. Fix CSS themes

## 7. Build Small UI/UX

1. Simple transfer widget
2. Currency xchange

## 8. Updated API for Wise data pipelines

1. Currencies
2. Quotes and Rates

## 9. Final Changes

1. Rechart and Comparisons
2. UI finetuning
