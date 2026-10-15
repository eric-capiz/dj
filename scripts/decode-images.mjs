// Decodes the base64 sidecar images in public/img/ (*.webp.b64) into real
// binary .webp files before the Next.js build runs.
//
// Why: the GitHub connector used to push this repo only supports text file
// content, so binary images pushed through it arrived base64-encoded *as text*.
// The .b64 sidecars are the source of truth; this script restores the binaries
// at build time (locally and on Vercel via the `build` npm script).
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const imgDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "img");
let decoded = 0;
for (const file of readdirSync(imgDir)) {
  if (!file.endsWith(".webp.b64")) continue;
  const b64 = readFileSync(join(imgDir, file), "utf8").replace(/\s+/g, "");
  const outName = file.slice(0, -".b64".length);
  writeFileSync(join(imgDir, outName), Buffer.from(b64, "base64"));
  decoded++;
  console.log(`[decode-images] ${file} -> ${outName}`);
}
if (decoded === 0) console.log("[decode-images] no .b64 sidecars found, nothing to do");
