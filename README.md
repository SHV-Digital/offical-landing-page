# SHV Digital landing page

React + Vite landing page with Portuguese, English and Spanish translations and build-time prerendering.

## Development

```sh
npm install
npm run dev
```

Language is determined by the URL: `/pt-BR/`, `/en/`, `/es/`. The root `/` uses Portuguese and points its canonical URL to `/pt-BR/`. Header flag links navigate to the corresponding language; no browser language or saved preference overrides shared URLs. Content lives in `src/i18n.js`.

The header language dropdown shows the current flag and language code. Its native disclosure works without JavaScript; with JavaScript, Escape and outside clicks close it. It supports keyboard navigation and reduced-motion preferences. The dropdown heading and accessible label follow the current page language.

Keep decorative background glows clipped inside their own layers to prevent horizontal overflow on mobile. Do not clip the header itself: its language dropdown must be able to extend below it. Check the header and open dropdown at narrow mobile widths in all three languages after layout changes.

## Adding or changing content

Every user-facing change must be provided in **Portuguese (Brazil), English, and Spanish** in the same update. Add matching translation keys in all three objects in `src/i18n.js`, including accessibility text and SEO metadata where applicable. Do not hardcode translated text in components. Repository-wide agent instructions are in `AGENTS.md`.

## Public URL (no configuration required)

**The default public URL is https://shvdigital.com.br/. No `.env` file is needed** for development or a production build on this domain. Missing or empty `SITE_URL` values use this default automatically.

Only if you need a different domain, copy `.env.example` to `.env` and change:

```dotenv
SITE_URL=https://your-other-domain.com
```

`SITE_URL` is public configuration, not a secret. It tells the build which full URLs to write into canonical links, language alternates, SHV logo social previews, structured data, `sitemap.xml`, and `robots.txt`. It does not publish the website or configure hosting. A deployment environment variable can also override the default. Use only an HTTP(S) origin, without a subpath, query, or fragment; a trailing slash is accepted and normalized internally to avoid double slashes.

The fallback is defined in `src/seo.js`. `scripts/prerender.mjs` reads the optional override for production, and `vite.config.js` uses it for development metadata. Rebuild after changing it.

## Production

Run the following commands—creating `.env` is **not required**:

```sh
npm test
npm run lint
npm run build
npm run test:build # optional: rebuild and validate the generated HTML
npm run preview
```

Deploy **all of `dist/`** to a static host that serves directory `index.html` files. The build generates `/index.html`, `/pt-BR/index.html`, `/en/index.html`, and `/es/index.html`, each with fully rendered localized content, language attributes, metadata, canonical/hreflang links, Open Graph/Twitter logo previews, and JSON-LD. React hydrates the existing HTML for interactions. `.prerender/` is an intermediate build directory, not a deployment artifact.

Serve the language directories before any SPA catch-all rewrite; rewriting every locale to the root HTML would return Portuguese metadata to crawlers. Prefer a real 404 for unknown paths. Lowercase `/en/` and `/es/` are the canonical public URLs; configure host redirects from `/EN/` and `/ES/` if those aliases are needed in production. Also redirect slashless URLs to their trailing-slash equivalents. If your host cannot serve directory indexes, add explicit rewrites from each locale to its own `index.html`.

`dist/sitemap.xml` and `dist/robots.txt` are generated using `SITE_URL`. Submit `/sitemap.xml` to search engines after deployment. Rebuild whenever translations or the production domain change.

The original-style logo intro is restored as a decorative 2.8-second overlay with a soft glow, scale/blur reveal, and fade-out. The page is always rendered underneath; the overlay is hidden in static HTML and only starts after hydration. Scrolling, clicking, or pressing a key dismisses it immediately, and reduced-motion users, direct section links, and restored scroll positions skip it. It does not intercept clicks or keyboard focus.

Hero and scroll-entry animations progressively enhance the visible HTML through the Web Animations API and IntersectionObserver. Without JavaScript or with reduced motion, content remains visible without the intro or entrance animations. Hover interactions respect the Framer Motion reduced-motion configuration. Contact submissions continue to use the existing Formspree endpoint and include the selected language.
