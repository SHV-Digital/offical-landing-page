import { getLocale, locales, translations } from './i18n.js';

// The official domain works out of the box; SITE_URL is only an optional override.
export const defaultSiteUrl = 'https://shvdigital.com.br/';

export function normalizeSiteUrl(value = defaultSiteUrl) {
  const url = new URL(value || defaultSiteUrl);
  if (!['https:', 'http:'].includes(url.protocol) || url.pathname !== '/' || url.search || url.hash || url.username || url.password) {
    throw new Error('SITE_URL must be an HTTP(S) origin, e.g. https://shvdigital.com.br');
  }
  return url.origin;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

export function renderSeo(pathname, siteUrl = defaultSiteUrl) {
  const origin = normalizeSiteUrl(siteUrl);
  const locale = getLocale(pathname);
  const content = translations[locale.code];
  const canonical = `${origin}/${locale.code}/`;
  const image = `${origin}/logo_square.png`;
  const meta = (name, value, attribute = 'name') => `<meta ${attribute}="${name}" content="${escapeHtml(value)}" />`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': `${origin}/#organization`, name: 'SHV Digital', url: origin, logo: image, email: 'contato@shvdigital.com.br' },
      { '@type': 'WebSite', '@id': `${origin}/#website`, name: 'SHV Digital', url: origin, inLanguage: locales.map(({ code }) => code), publisher: { '@id': `${origin}/#organization` } },
      { '@type': 'WebPage', '@id': canonical, url: canonical, name: content.title, description: content.description, inLanguage: locale.code, isPartOf: { '@id': `${origin}/#website` }, about: { '@id': `${origin}/#organization` } },
    ],
  };
  return [
    `<title>${escapeHtml(content.title)}</title>`,
    meta('description', content.description),
    meta('robots', 'index, follow, max-image-preview:large'),
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    ...locales.map(({ code }) => `<link rel="alternate" hreflang="${code}" href="${escapeHtml(`${origin}/${code}/`)}" />`),
    `<link rel="alternate" hreflang="x-default" href="${escapeHtml(`${origin}/pt-BR/`)}" />`,
    meta('og:type', 'website', 'property'),
    meta('og:site_name', 'SHV Digital', 'property'),
    meta('og:title', content.title, 'property'),
    meta('og:description', content.description, 'property'),
    meta('og:url', canonical, 'property'),
    meta('og:locale', locale.og, 'property'),
    ...locales.filter(({ code }) => code !== locale.code).map(({ og }) => meta('og:locale:alternate', og, 'property')),
    meta('og:image', image, 'property'),
    meta('og:image:type', 'image/png', 'property'),
    meta('og:image:alt', 'SHV Digital', 'property'),
    meta('twitter:card', 'summary'),
    meta('twitter:title', content.title),
    meta('twitter:description', content.description),
    meta('twitter:image', image),
    meta('twitter:image:alt', 'SHV Digital'),
    `<script type="application/ld+json">${JSON.stringify(structuredData).replace(/</g, '\\u003c')}</script>`,
  ].join('\n    ');
}

export function renderSitemap(siteUrl = defaultSiteUrl) {
  const origin = normalizeSiteUrl(siteUrl);
  const alternates = [...locales.map(({ code }) => ({ code, path: `/${code}/` })), { code: 'x-default', path: '/pt-BR/' }];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${locales.map(({ code }) => `  <url><loc>${escapeHtml(`${origin}/${code}/`)}</loc>${alternates.map((alternate) => `<xhtml:link rel="alternate" hreflang="${alternate.code}" href="${escapeHtml(origin + alternate.path)}" />`).join('')}</url>`).join('\n')}\n</urlset>\n`;
}
