# DJ Space Jam

A cosmic DJ experience — a Next.js site with an immersive hero (animated light rays, headphone branding, interactive turntable) and content sections for about, samples, contact, tour dates, and media.

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
- **Turntable** — Centered DJ controller UI (jog wheels, mixer panel, nav knobs) with GSAP-driven interactions. Knobs: Home, About, Tour dates (T), Media, Samples, SoundCloud (O), Instagram (I), Contact, Thread (T); external links open in a new tab.

## Contact form

The Contact section includes a simple form (name, email, message). Submissions are sent to **ericcapiz@gmail.com** via [FormSubmit](https://formsubmit.co) using native `fetch` (no third-party JS libraries). No signup or env vars required; the recipient email is in the form component. To use a different email, set `FORMSUBMIT_EMAIL` in `components/ContactForm/ContactForm.tsx`.

## TODO

- [ ] **Content for each page** — Copy and assets for About, Samples, Contact, Tour dates, Media
- [ ] **Plan for uploading small music files (10–25 sec)** — Hosting, format, and playback for sample clips
- [ ] **Implement social links** — Wire turntable knobs (SoundCloud, Instagram, Thread) to real profile URLs
- [ ] **Refactor code if needed** — Clean up and structure after features are in place
- [ ] **Plan for mobile responsiveness** — e.g. nav links for viewports smaller than tablet instead of turntable
- [ ] **Testing** — Manual and/or automated tests before launch
- [ ] **Deploy** — Ship to Vercel or chosen host

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

## Notes

### React 19 features to consider

Where React 19–specific APIs could fit in this project (no code uses them yet):

| Feature                                                   | Where it makes sense                                                                                                                                                                                                            |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Server Actions + `useFormStatus` / `useFormState`**     | **Contact form** — Use a Server Action to send the message; `useFormStatus` for a “Sending…” state and disabled submit; `useFormState` for success/error without extra client state.                                            |
| **`useOptimistic`**                                       | **Contact form or any mutation** — Show “Sent!” or update UI immediately before the server responds, then revert or confirm when the response comes back.                                                                       |
| **`use()`**                                               | **Data-driven client components** — If you later pass a promise (e.g. sample list or CMS data) from a Server Component into a client component, `use()` lets you read that promise during render and suspend until it resolves. |
| **`ref` as a normal prop**                                | **Reusable components that need refs** — When you add shared UI (e.g. form inputs, modals, audio player) that parents need to reference, you can accept `ref` like any other prop instead of using `forwardRef`.                |
| **Document metadata (`<title>`, `<meta>` in components)** | **Per-page titles/descriptions** — Next already handles this via `layout`/`metadata`; React 19’s built-in support is an option if you prefer defining title/meta inside a page or component instead.                            |
