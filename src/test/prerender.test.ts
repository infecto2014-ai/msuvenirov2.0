import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(__dirname, "../..");
const DIST = path.join(ROOT, "dist");
const SITE = "https://msuvenirov.ru";

const INDEXABLE: Array<[string, string]> = [
  ["/", "index.html"],
  ["/price", "price.html"],
  ["/faq", "faq.html"],
  ["/pechat_na_tkani", "pechat_na_tkani.html"],
  ["/mug-print", "mug-print.html"],
  ["/public-offer", "public-offer.html"],
  ["/privacy-policy", "privacy-policy.html"],
];

const hasDist = existsSync(DIST);
if (!hasDist) {
  // eslint-disable-next-line no-console
  console.warn("[prerender.test] dist/ not found - run `npm run build` first; post-build tests are skipped.");
}
const d = hasDist ? describe : describe.skip;

const load = (file: string) => {
  const html = readFileSync(path.join(DIST, file), "utf8");
  return { html, doc: new DOMParser().parseFromString(html, "text/html") };
};

d("prerendered pages (post-build)", () => {
  for (const [route, file] of INDEXABLE) {
    describe(`${route} (${file})`, () => {
      const { html, doc } = hasDist ? load(file) : ({} as ReturnType<typeof load>);
      const canonical = route === "/" ? `${SITE}/` : `${SITE}${route}`;

      it("should have exactly one non-empty <title>", () => {
        const titles = doc.querySelectorAll("title");
        expect(titles.length).toBe(1);
        expect(titles[0].textContent?.trim().length).toBeGreaterThan(0);
      });

      it("should have exactly one meta description of 1..160 chars", () => {
        const m = doc.querySelectorAll('meta[name="description"]');
        expect(m.length).toBe(1);
        const len = (m[0].getAttribute("content") ?? "").trim().length;
        expect(len).toBeGreaterThan(0);
        expect(len).toBeLessThanOrEqual(160);
      });

      it("should have exactly one canonical equal to the absolute route URL", () => {
        const c = doc.querySelectorAll('link[rel="canonical"]');
        expect(c.length).toBe(1);
        expect(c[0].getAttribute("href")).toBe(canonical);
      });

      it("should have exactly one og:url equal to canonical", () => {
        const o = doc.querySelectorAll('meta[property="og:url"]');
        expect(o.length).toBe(1);
        expect(o[0].getAttribute("content")).toBe(canonical);
      });

      it("should have a single og:title and og:description (no duplicates from template)", () => {
        expect(doc.querySelectorAll('meta[property="og:title"]').length).toBe(1);
        expect(doc.querySelectorAll('meta[property="og:description"]').length).toBe(1);
      });

      it("should render an <h1> with text", () => {
        const h1 = doc.querySelector("h1");
        expect(h1).not.toBeNull();
        expect(h1!.textContent?.trim().length).toBeGreaterThan(0);
      });

      it("should mark #root with data-prerendered-route equal to the route", () => {
        expect(doc.getElementById("root")?.getAttribute("data-prerendered-route")).toBe(route);
      });

      it("should contain substantial prerendered body text", () => {
        const text = (doc.getElementById("root")?.textContent ?? "").replace(/\s+/g, " ").trim();
        expect(text.length).toBeGreaterThan(300);
      });

      it("should have only valid application/ld+json blocks", () => {
        const blocks = Array.from(doc.querySelectorAll('script[type="application/ld+json"]'));
        for (const b of blocks) {
          expect(() => JSON.parse(b.textContent ?? "")).not.toThrow();
        }
      });

      it("should not be noindex", () => {
        const robots = Array.from(doc.querySelectorAll('meta[name="robots"]')).map((m) => m.getAttribute("content") ?? "");
        for (const r of robots) expect(r.toLowerCase()).not.toContain("noindex");
      });

      it('should not contain the removed price claim "от 280"', () => {
        expect(doc.body.textContent ?? "").not.toContain("от 280");
        expect(html).not.toContain("от 280");
      });
    });
  }

  describe("404.html", () => {
    const { doc } = hasDist ? load("404.html") : ({} as ReturnType<typeof load>);

    it("should be noindex", () => {
      const robots = Array.from(doc.querySelectorAll('meta[name="robots"]')).map((m) => (m.getAttribute("content") ?? "").toLowerCase());
      expect(robots.some((r) => r.includes("noindex"))).toBe(true);
    });

    it("should have no canonical", () => {
      expect(doc.querySelectorAll('link[rel="canonical"]').length).toBe(0);
    });

    it("should have no og:url", () => {
      expect(doc.querySelectorAll('meta[property="og:url"]').length).toBe(0);
    });

    it("should not carry a data-prerendered-route marker", () => {
      expect(doc.getElementById("root")?.hasAttribute("data-prerendered-route")).toBe(false);
    });
  });
});

describe("public/sitemap.xml", () => {
  const xml = readFileSync(path.join(ROOT, "public/sitemap.xml"), "utf8");
  const locs = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1].trim());

  for (const [route] of INDEXABLE) {
    const url = route === "/" ? `${SITE}/` : `${SITE}${route}`;
    it(`should list ${url}`, () => {
      expect(locs).toContain(url);
    });
  }

  it("should not list /card", () => {
    expect(locs.some((l) => l.includes("/card"))).toBe(false);
  });

  it("should not contain duplicate URLs", () => {
    expect(new Set(locs).size).toBe(locs.length);
  });
});
