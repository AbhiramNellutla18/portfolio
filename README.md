# Abhiram Nellutla — The Creative Engineer

Personal portfolio for an Artificial Intelligence and Machine Learning student at GRIET, Hyderabad.

**Live website:** https://abhiramnellutla.me

## Stack

Next.js App Router, React, TypeScript, Tailwind CSS, Motion and Lucide. The site exports static HTML for each route.

## Run locally

Requires Node.js 20.9 or newer and pnpm.

```sh
pnpm install
pnpm dev
```

Open http://localhost:3000.

```sh
pnpm build
pnpm typecheck
```

The production build is in `out/`.

## What's inside

- Responsive ivory, coral and pastel design with frosted glass accents.
- Interactive classification and gradient descent experiments.
- Five project case studies with synthetic, interactive illustrations.
- Animated neural-network graphics in an original workstation artwork.
- GitHub repository search and language filters with offline fallbacks.
- Command palette, keyboard navigation and reduced-motion support.
- Email and LinkedIn contact actions.

## Customize

- `data/profile.ts` holds contact details, the public origin and repository visibility settings.
- `data/projects.ts` holds project descriptions, technologies, evidence and case-study content.
- `app/globals.css`, `app/glass.css` and `app/notebook.css` define the shared visual system.
- `public/images/` holds the artwork. The workstation scene is AI-generated, with SVG monitor graphics overlaid in code.
- Set `resume` in the profile configuration to a real URL or add a PDF to `public/` to enable resume links.

## Environment

```text
NEXT_PUBLIC_SITE_URL=https://your-domain.example
GITHUB_TOKEN=optional-build-only-token
```

GitHub data is fetched at build time and refreshed from the public API in the browser. The browser uses a one-hour cache and reviewed repository fallbacks when GitHub is unavailable. The optional token is server-only. Keep environment files untracked.

## Deploy

Import this repository into Vercel as a Next.js project and use `pnpm build`. Set the public site origin before building. Static hosts can serve the generated `out/` directory.

This repository contains the application source. The running website's custom-domain and hosting settings are managed separately.

## Project evidence

Kavacha, HealthGrid and BrokenVault were reviewed against their public repository documentation. HealthGrid is a frontend prototype. BrokenVault is a team project. AAVARTA and the attendance prototype retain source-unverified labels where appropriate. Interactive visuals use synthetic inputs. Individual contributions and deployed scientific or security results are claimed only when supported.

## Contact

Email opens the visitor's mail application and can be copied to the clipboard. LinkedIn uses the provided profile URL. A contact form service and resume are not configured.
