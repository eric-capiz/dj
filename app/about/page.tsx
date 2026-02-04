import Link from "next/link";

export default function About() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold text-white mb-4">About</h1>
      <p className="text-slate-400 mb-8 max-w-md text-center">
        Space Jam — your cosmic DJ experience.
      </p>
      <Link
        href="/"
        className="text-indigo-400 hover:text-indigo-300 transition-colors"
      >
        ← Back to deck
      </Link>
    </main>
  );
}
