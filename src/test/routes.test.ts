import { describe, it, expect } from "vitest";
import { routeDefs, notFoundDef, normalizePath } from "@/routes";

describe("normalizePath", () => {
  it("should keep root as /", () => expect(normalizePath("/")).toBe("/"));
  it("should strip one trailing slash", () => expect(normalizePath("/price/")).toBe("/price"));
  it("should strip several trailing slashes", () => expect(normalizePath("/faq//")).toBe("/faq"));
  it("should leave clean paths untouched", () => expect(normalizePath("/mug-print")).toBe("/mug-print"));
  it("should collapse a slashes-only path to /", () => expect(normalizePath("///")).toBe("/"));
});

describe("route table", () => {
  const paths = routeDefs.map((r) => r.path);

  it("should contain every public route", () => {
    for (const p of ["/", "/price", "/faq", "/pechat_na_tkani", "/mug-print", "/public-offer", "/privacy-policy", "/card"]) {
      expect(paths).toContain(p);
    }
  });

  it("should have unique paths", () => expect(new Set(paths).size).toBe(paths.length));

  it("should use clean normalized paths", () => {
    for (const p of paths) expect(normalizePath(p)).toBe(p);
  });

  it("should use * for the not-found route", () => expect(notFoundDef.path).toBe("*"));
});
