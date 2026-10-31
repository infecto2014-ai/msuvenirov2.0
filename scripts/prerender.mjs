// Build-time prerender: renders every indexable route with the Vite SSR bundle
// (dist-ssr/entry-server.js) and writes flat HTML files into dist/.
// No headless browser required.
import { readFile, writeFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

process.env.NODE_ENV = "production"; // production React server build (set before importing the bundle)

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");

// route -> output file (flat files: nginx `try_files $uri $uri.html`)
const ROUTES = [
  ["/", "index.html"],
  ["/price", "price.html"],
  ["/faq", "faq.html"],
  ["/pechat_na_tkani", "pechat_na_tkani.html"],
  ["/mug-print", "mug-print.html"],
  ["/public-offer", "public-offer.html"],
  ["/privacy-policy", "privacy-policy.html"],
  ["/card", "card.html"], // noindex (Seo component); not in sitemap, Disallow in robots.txt
];
const NOT_FOUND_URL = "/__not-found__";

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Remove tags from the template head that Helmet re-supplies, to avoid duplicates. */
function dedupeTemplate(tpl, head, route) {
  // Static tags marked data-rh="true" are owned by Helmet: drop them all
  let out = tpl.replace(/[ \t]*<(?:meta|link)\b[^>]*\bdata-rh="true"[^>]*>[ \t]*\r?\n?/g, "");
  if (head.title) out = out.replace(/[ \t]*<title>[\s\S]*?<\/title>\s*?\n?/, "");

  const keys = new Set();
  for (const tag of head.meta.match(/<meta\b[^>]*>/g) ?? []) {
    const m = tag.match(/\b(?:name|property)="([^"]+)"/);
    if (m) keys.add(m[1]);
  }
  for (const key of keys) {
    out = out.replace(
      new RegExp(`[ \\t]*<meta\\b[^>]*?\\b(?:name|property)="${esc(key)}"[^>]*>[ \\t]*\\r?\\n?`, "g"),
      ""
    );
  }
  if (/rel="canonical"/.test(head.link)) {
    out = out.replace(/[ \t]*<link\b[^>]*\brel="canonical"[^>]*>[ \t]*\r?\n?/g, "");
  }
  // Drop template JSON-LD blocks whose top-level @type the page supplies itself
  out = out.replace(
    /[ \t]*<script type="application\/ld\+json">([\s\S]*?)<\/script>[ \t]*\r?\n?/g,
    (block, json) => {
      const type = json.match(/"@type"\s*:\s*"([^"]+)"/)?.[1];
      const supplied = type && new RegExp(`"@type"\\s*:\\s*"${esc(type)}"`).test(head.script);
      // Template LocalBusiness / home FAQPage describe the home page only (home visibly renders that FAQ)
      const homeOnly = route !== "/" && (type === "LocalBusiness" || type === "FAQPage");
      return supplied || homeOnly ? "" : block;
    }
  );
  return out;
}

function inject(tpl, route, { html, head: headIn }, { notFound = false } = {}) {
  let head = headIn;
  let out = dedupeTemplate(tpl, head, route);
  if (notFound) {
    // 404 page: no canonical / og:url pointing at the fake URL used for rendering
    head = { ...head, link: head.link.replace(/<link\b[^>]*\brel="canonical"[^>]*>/g, ""), meta: head.meta.replace(/<meta\b[^>]*\bproperty="og:url"[^>]*>/g, "") };
  }
  const headTags = [head.base, head.title, head.priority, head.meta, head.link, head.script, head.noscript, head.style]
    .filter(Boolean)
    .join("\n    ");
  if (headTags) out = out.replace("</head>", `    ${headTags}\n  </head>`);

  const marker = notFound ? "" : ` data-prerendered-route="${route}"`;
  if (!out.includes('<div id="root"></div>')) throw new Error("Template has no empty #root");
  return out.replace('<div id="root"></div>', () => `<div id="root"${marker}>${html}</div>`);
}

async function main() {
  const template = await readFile(path.join(distDir, "index.html"), "utf8");
  if (template.includes("data-prerendered-route")) throw new Error("dist/index.html already prerendered");

  const { render } = await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href);

  for (const [route, file] of ROUTES) {
    const result = await render(route);
    await writeFile(path.join(distDir, file), inject(template, route, result), "utf8");
    console.log(`[prerender] ${route} -> dist/${file} (${result.html.length} bytes of body)`);
  }

  const nf = await render(NOT_FOUND_URL);
  await writeFile(path.join(distDir, "404.html"), inject(template, NOT_FOUND_URL, nf, { notFound: true }), "utf8");
  console.log("[prerender] 404 -> dist/404.html");
}

try {
  await main();
} finally {
  if (existsSync(ssrDir)) await rm(ssrDir, { recursive: true, force: true });
}

