/**
 * serve-out.mjs — serve a built `out/` the way Cloudflare Pages does, for local review only.
 *
 * Why it exists: under `output: "export"`, `next dev` (Next 14.2.35) answers every Hebrew dynamic
 * route — /services/<slug>/, /locations/<slug>/, /מדריכים/<slug>/, /blog/<slug>/ — with a 500
 * ("missing param … in generateStaticParams()"), because the request arrives percent-encoded. So the
 * owner's image board (CLAUDE.md §15) reviews a draft *build* instead of `npm run dev:images`:
 *
 *   IMAGES_DRAFT=1 npm run build      # PowerShell: $env:IMAGES_DRAFT="1"; npm run build; Remove-Item env:IMAGES_DRAFT
 *   node scripts/serve-out.mjs        # http://localhost:3000/ — the board's page links point here
 *
 * It decodes the path (NFC), serves `<dir>/index.html` for a folder and `404.html` for a miss, binds
 * 127.0.0.1 only and never caches. A draft `out/` carries `.images-draft` and `.live-draft`, so the
 * deploy script refuses it; rebuild without IMAGES_DRAFT before any deploy.
 *
 * Usage: node scripts/serve-out.mjs [dir=out] [port=3000]
 */
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";

const root = path.resolve(process.argv[2] ?? "out");
const port = Number(process.argv[3] ?? 3000);
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
};

if (!existsSync(root)) {
  console.error(`serve-out: ${root} does not exist; run npm run build first`);
  process.exit(1);
}

/** The file a request path maps to, or null (outside the root, undecodable or missing). */
function fileFor(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath).normalize("NFC");
  } catch {
    return null;
  }
  const abs = path.resolve(root, `.${decoded}`);
  if (abs !== root && !abs.startsWith(root + path.sep)) return null;
  for (const candidate of [abs, path.join(abs, "index.html"), `${abs}.html`]) {
    try {
      if (statSync(candidate).isFile()) return candidate;
    } catch {
      // not this one
    }
  }
  return null;
}

function send(res, file, status) {
  res.writeHead(status, {
    "content-type": TYPES[path.extname(file).toLowerCase()] ?? "application/octet-stream",
    "cache-control": "no-store",
  });
  createReadStream(file).pipe(res);
}

createServer((req, res) => {
  const { pathname } = new URL(req.url ?? "/", "http://localhost");
  const file = fileFor(pathname);
  if (file) return send(res, file, 200);
  const notFound = path.join(root, "404.html");
  if (existsSync(notFound)) return send(res, notFound, 404);
  res.writeHead(404);
  res.end("not found");
}).listen(port, "127.0.0.1", () => {
  const draft = existsSync(path.join(root, ".images-draft")) ? " (images draft)" : "";
  console.log(`serve-out: ${root}${draft} at http://localhost:${port}/`);
});
