# Agent instructions

These instructions apply to the entire repository.

## Languages

- Every new or changed user-facing feature must support all three languages: Portuguese (Brazil), English, and Spanish.
- Add or update the corresponding content in **all three** translation objects in `src/i18n.js` in the same change. Keep their keys and structure consistent; do not leave untranslated placeholders or hardcode user-facing text in components.
- Translate navigation, headings, descriptions, buttons, form labels, validation messages, accessibility labels, image descriptions, and language-specific SEO metadata where applicable. Brand names and technical identifiers can remain unchanged.
- Preserve URL-based language selection: `/pt-BR/`, `/en/`, and `/es/`. The root `/` uses Portuguese. Keep the header language selectors available on mobile and desktop.
- Preserve prerendered, visible content and localized metadata for every language. Do not make content or SEO depend on JavaScript running in the browser.

## Default public URL

- The site must work without any `.env` file. Its default public URL is **https://shvdigital.com.br/**.
- Keep the fallback centralized in `src/seo.js`. An optional `SITE_URL` environment variable or `.env` entry can override it; an unset or empty value must use the default.
- Use the configured origin for canonical URLs, hreflang links, social image URLs, structured data, sitemap, and robots.txt. Do not duplicate hardcoded domains across components.
- Never require developers or deployment environments to create `.env` for the standard SHV domain. Explain configuration as optional in documentation.

## Validation

- Run `npm test`, `npm run lint`, and `npm run test:build` after relevant changes.
- Check all three languages when changing content or layout, including the responsive header and accessibility labels.
- Keep the README current when configuration, language routes, or deployment behavior changes.
