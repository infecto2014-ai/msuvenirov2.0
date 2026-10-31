import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { HelmetProvider, type HelmetServerState } from "react-helmet-async";
import { Writable } from "node:stream";
import { forceLoadAllSections } from "./hooks/useLazySection";
import { AppProviders, AppRoutes, createQueryClient } from "./App";

export interface RenderResult {
  html: string;
  /** Serialized <head> tags produced by react-helmet-async, keyed by kind. */
  head: Record<string, string>;
}

// Render all below-the-fold lazy sections into the static HTML
forceLoadAllSections();

const HEAD_KEYS = ["title", "priority", "base", "meta", "link", "script", "noscript", "style"] as const;

/** Render a URL to static HTML, waiting for all lazy routes/sections (onAllReady). */
export function render(url: string): Promise<RenderResult> {
  const helmetContext: { helmet?: HelmetServerState } = {};

  return new Promise<RenderResult>((resolve, reject) => {
    const chunks: Buffer[] = [];
    let failure: Error | undefined;
    const sink = new Writable({
      write(chunk, _enc, cb) {
        chunks.push(Buffer.from(chunk));
        cb();
      },
      final(cb) {
        if (failure) {
          reject(failure);
          return cb();
        }
        const head: Record<string, string> = {};
        for (const key of HEAD_KEYS) head[key] = (helmetContext.helmet as any)?.[key]?.toString() ?? "";
        resolve({ html: Buffer.concat(chunks).toString("utf8"), head });
        cb();
      },
    });

    const timer = setTimeout(() => reject(new Error(`Prerender timeout for ${url}`)), 30000);
    const { pipe, abort } = renderToPipeableStream(
      <HelmetProvider context={helmetContext}>
        <AppProviders client={createQueryClient()}>
          <StaticRouter location={url}>
            <AppRoutes />
          </StaticRouter>
        </AppProviders>
      </HelmetProvider>,
      {
        onAllReady() {
          clearTimeout(timer);
          pipe(sink);
        },
        onShellError(err) {
          clearTimeout(timer);
          reject(err);
        },
        onError(err) {
          // Any render error must fail the build rather than ship a half-rendered page.
          console.error(`[prerender] ${url}:`, err);
          failure = failure ?? (err instanceof Error ? err : new Error(String(err)));
        },
      }
    );
    sink.on("error", (e) => {
      abort();
      reject(e);
    });
  });
}
