# DJ Space Jam

A cosmic DJ experience — a Next.js site with an immersive hero (animated light rays, headphone branding, interactive turntable) and content sections for about, samples, contact, residencies, and media.

## Tech stack

- **[Next.js](https://nextjs.org)** (App Router) — React framework, routing, and build
- **[React](https://react.dev)** 19 — UI
- **[TypeScript](https://www.typescriptlang.org)** — Typing
- **[Tailwind CSS](https://tailwindcss.com)** v4 — Styling

## Libraries used

| Library                                                                       | Purpose                                                                       |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| [**Motion**](https://motion.dev) (Framer Motion)                              | Hero title letter animation and UI motion                                     |
| [**GSAP**](https://gsap.com) + [**@gsap/react**](https://gsap.com/docs/react) | Turntable animations (platters, knobs, faders)                                |
| [**OGL**](https://github.com/oframe/ogl)                                      | WebGL renderer for the hero light rays (shader-based rays with color cycling) |

## Hero section (current)

- **Light rays** — Full-screen WebGL rays from the top; space-theme color cycling every ~1.8s with smooth transitions; optional sync of headphone SVG color to the rays.
- **Hero title** — “DJ Space Jam” inside a headphone graphic (inline SVG) with gradient/synced color and motion-animated text.
- **Turntable** — Centered DJ controller UI (jog wheels, mixer panel, nav knobs) with GSAP-driven interactions; knobs route to content sections (About, Samples, Contact, Residencies, Media).

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — Run ESLint

## Deploy

You can deploy with [Vercel](https://vercel.com) or any platform that supports Next.js.
