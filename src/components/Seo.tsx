import type { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://msuvenirov.ru';

interface SeoProps {
  title: string;
  description: string;
  /** Path starting with "/", e.g. "/price". Use "/" for the home page. */
  path: string;
  noindex?: boolean;
  children?: ReactNode;
}

/** Canonical absolute URL: no trailing slash except the home page. */
export const canonicalUrl = (path: string): string => {
  const clean = path.replace(/\/+$/, '');
  return clean ? `${SITE_URL}${clean.startsWith('/') ? clean : `/${clean}`}` : `${SITE_URL}/`;
};

/** Complete per-page head block: title, description, canonical, OG and Twitter tags. */
const Seo = ({ title, description, path, noindex = false, children }: SeoProps) => {
  const url = canonicalUrl(path);
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, follow" />}
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {children}
    </Helmet>
  );
};

export default Seo;
