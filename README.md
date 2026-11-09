# SHV Digital landing page

React + Vite landing page with Portuguese, English and Spanish translations and build-time prerendering.

## Development

```sh
npm install
npm run dev
```

Language is determined by the URL: `/pt-BR/`, `/en/`, `/es/`. The root `/` uses Portuguese and points its canonical URL to `/pt-BR/`. Header flag links navigate to the corresponding language; no browser language or saved preference overrides shared URLs. Content lives in `src/i18n.js`.

The header language dropdown shows the current flag and language code. Its native disclosure works without JavaScript; with JavaScript, Escape and outside clicks close it. It supports keyboard navigation and reduced-motion preferences. The dropdown heading and accessible label follow the current page language.

Keep header links in page order on desktop and mobile: **Sobre → Diferenciais → Serviços** (English: About → Why SHV → Services; Spanish: Nosotros → Por qué SHV → Servicios). Update the anchor order and all translated labels together.

The header has an animated purple/blue border ring, a logo tilt/glow on hover or keyboard focus, and a color-flow/light-sweep contact button that never scales. Navigation highlights the section currently underneath the fixed header, using a purple pill, underline, and `aria-current="location"`; the contact button is highlighted in the contact section. Links remain visible in a second compact row on mobile. Section detection follows document order (About → Why SHV → Services → Contact), including direct hash links and the bottom of the page, rather than assuming navigation-link order. Reduced motion disables the ring and animated transforms/sweeps; forced-colors mode preserves borders and the active-location indication.

The ring has brighter moving purple/blue highlights on a two-pixel stroke and a six-second loop. Selected navigation items have a short light sweep and settling label animation. Clicking a header anchor immediately highlights only that destination during smooth scrolling, rather than flashing intermediate sections. Wheel/touch/scroll-key interruptions return to normal scroll tracking; a timeout prevents a stale destination lock. The logo uses the native `#inicio` anchor to return to the top without reloading or replaying the intro. Modified clicks and no-JavaScript anchor navigation keep their normal browser behavior. The language trigger, panel, selected row, and focus treatments share the same purple/blue palette and subtle light-sweep treatment.

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

The opening sequence reveals the original SHV mark with a 3D turn and soft glow, then moves it from the center of the viewport into the hero's logo position over 3.2 seconds. The destination is measured at runtime, so the same transition lands on the left on desktop and above the text on mobile. A glowing purple slogan and staggered copy appear alongside it. The mark uses layered copies of the existing transparent PNG for depth—no WebGL runtime or new brand asset is needed. No detached orbital lines or background grid remain behind the moving mark.

The settled logo rotates automatically and is shown on its own, without a brand caption, movement symbol, instruction sentence, or pause icon underneath. Drag horizontally with a mouse or finger to rotate it; mouse/pen drags can also tilt it vertically. Vertical touch swipes continue scrolling the page, and pinch zoom remains available. Automatic rotation freezes during the drag and continues from its current position on release, without resetting the user's orientation. An explicitly paused logo stays paused after dragging. Focus the logo and use arrow keys to rotate or Home to reset the manual orientation. Instructions remain available to screen readers, and a pause/resume text control is visually hidden until keyboard focus so users can still stop continuous motion without cluttering the default design. Gesture cancellation, focus loss, or leaving the page releases the drag. Instructions and accessible labels are localized in all three languages. Reduced motion disables automatic rotation but still allows deliberate manual interaction.

The purple slogan uses an uninterrupted breathing glow instead of a clipped gradient, with an extra halo on hover or touch. The headline retains a single off-white source text; `WaveHeadline` measures its actual rendered lines and overlays a decorative purple wave on **one line at a time**, left to right and then top to bottom. Line boundaries are recalculated on resize and font loading for every language. The overlay is hidden from assistive technology and excluded from selection; the original text stays readable underneath. The descriptive paragraph ("Projetamos e desenvolvemos…" in Portuguese) has a visible 4.6-second breathing cycle from neutral gray to soft lavender-white with a light glow, without fading out or shifting position. The same pause/resume button controls the logo and repeating text effects. Reduced-motion users, no-JavaScript visitors, and forced-colors users get static, readable text without the wave.

Moving the pointer across any of the three hero text blocks (slogan, headline, description) temporarily replaces its automatic effect with a local purple spotlight and soft halo around the cursor; text farther away stays white. Each block's normal animation freezes while highlighted and resumes from its previous phase when the pointer leaves. Touch shows the effect only while pressed, without blocking scrolling; release/cancel clears it. The effect uses the existing text rather than duplicate content and works in all languages. Reduced-motion mode retains only this directly controlled interaction; forced-colors mode keeps system text colors.

The spotlight halo uses its own circular, generously sized layer with a fully transparent outer margin and soft blur. Keep it independent of text-block dimensions so short slogans do not reveal rectangular glow boundaries.

The page is always rendered underneath; the intro is hidden in static HTML and only starts after hydration. Scrolling, clicking, pressing a key, or resizing dismisses it immediately. Reduced-motion users, direct section links, and restored scroll positions skip it. It does not intercept clicks or keyboard focus. Reduced-motion users and no-JavaScript visitors see a static logo, and the pause control is hidden when it is not needed.

Hero and scroll-entry animations progressively enhance the visible HTML through the Web Animations API and IntersectionObserver. Without JavaScript or with reduced motion, content remains visible without the intro or entrance animations. Hover interactions respect the Framer Motion reduced-motion configuration. Contact submissions continue to use the existing Formspree endpoint and include the selected language.

The About section pairs localized editorial copy with numbered engineering-principle cards, using the same purple accents and scroll-reveal treatment. New headings and motion-control labels live in all three translation objects in `src/i18n.js`.
