import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { renderToString } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import Seo, { canonicalUrl } from "@/components/Seo";

// The global setup needs jsdom, so force helmet-async into its server mode (collects into context).
const provider = HelmetProvider as unknown as { canUseDOM: boolean };
const original = provider.canUseDOM;
beforeAll(() => {
  provider.canUseDOM = false;
});
afterAll(() => {
  provider.canUseDOM = original;
});

const renderHead =(props: Partial<React.ComponentProps<typeof Seo>> = {}) => {
  const context: any = {};
  renderToString(
    <HelmetProvider context={context}>
      <Seo title="T" description="D" path="/price" {...props} />
    </HelmetProvider>
  );
  const h = context.helmet;
  return {
    title: h.title.toString() as string,
    meta: h.meta.toString() as string,
    link: h.link.toString() as string,
  };
};

describe("canonicalUrl", () => {
  it("should keep the home page as site root with trailing slash", () => {
    expect(canonicalUrl("/")).toBe("https://msuvenirov.ru/");
  });
  it("should strip a trailing slash", () => {
    expect(canonicalUrl("/price/")).toBe("https://msuvenirov.ru/price");
  });
  it("should strip multiple trailing slashes", () => {
    expect(canonicalUrl("/faq///")).toBe("https://msuvenirov.ru/faq");
  });
  it("should add a leading slash when missing", () => {
    expect(canonicalUrl("faq")).toBe("https://msuvenirov.ru/faq");
  });
  it("should treat empty path as home", () => {
    expect(canonicalUrl("")).toBe("https://msuvenirov.ru/");
  });
  it("should preserve underscores and hyphens", () => {
    expect(canonicalUrl("/pechat_na_tkani")).toBe("https://msuvenirov.ru/pechat_na_tkani");
    expect(canonicalUrl("/mug-print/")).toBe("https://msuvenirov.ru/mug-print");
  });
});

describe("<Seo> server-side helmet output", () => {
  it("should emit title and description", () => {
    const { title, meta } = renderHead({ title: "Hello", description: "Desc" });
    expect(title).toContain("Hello");
    expect(meta).toContain('content="Desc"');
  });

  it("should emit a normalized canonical link", () => {
    expect(renderHead({ path: "/price/" }).link).toContain('href="https://msuvenirov.ru/price"');
  });

  it("should keep the home canonical with trailing slash", () => {
    expect(renderHead({ path: "/" }).link).toContain('href="https://msuvenirov.ru/"');
  });

  it("should emit og:url equal to canonical", () => {
    expect(renderHead({ path: "/faq/" }).meta).toContain('content="https://msuvenirov.ru/faq"');
  });

  it("should not emit robots noindex by default", () => {
    expect(renderHead().meta).not.toContain("noindex");
  });

  it("should emit robots noindex when noindex is set", () => {
    expect(renderHead({ noindex: true }).meta).toMatch(/name="robots"[^>]*noindex|content="noindex[^"]*"[^>]*name="robots"/);
  });
});
