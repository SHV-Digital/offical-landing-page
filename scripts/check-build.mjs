import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { locales, translations } from '../src/i18n.js';

for (const { code } of locales) {
  const html = await readFile(`dist/${code}/index.html`, 'utf8');
  const content = translations[code];
  assert.ok(html.includes(`<html lang="${code}">`));
  assert.equal((html.match(/<title>/g) || []).length, 1);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  const headlineText = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)[1].replace(/<[^>]*>/g, '');
  assert.equal(headlineText, `${content.hero.title} ${content.hero.line1} ${content.hero.line2}`, 'Headline preserves spaces and natural reading order');
  assert.ok(html.includes('class="hero-headline-source spotlight-ink block"'), 'Headline source remains visible and unsplit in static HTML');
  const heroHtml = html.match(/<section\b[^>]*id="inicio"[\s\S]*?<\/section>/)[0];
  const aboutHtml = html.match(/<section\b[^>]*id="sobre"[\s\S]*?<\/section>/)[0];
  assert.equal((heroHtml.match(/data-text-spotlight="true"/g) || []).length, 3, 'Home text supports the pointer spotlight');
  assert.equal((aboutHtml.match(/data-text-spotlight="true"/g) || []).length, content.about.paragraphs.length + 2, 'About text shares the Home interaction pattern');
  assert.ok(!html.includes('about-panel'), 'About flows directly in the page rather than an enclosing card');
  assert.ok(!html.includes('about-orbit-path'), 'Carousel has no decorative orbit lines behind the cards');
  assert.ok(!html.includes('class="headline-wave-line"'), 'Decorative line overlays are only added after hydration');
  assert.ok(html.includes(content.about.headline));
  assert.ok(aboutHtml.includes('about-editorial'), 'About retains its readable editorial text column');
  assert.ok(aboutHtml.includes('data-reveal-group="copy"'), 'About text is enhanced as one staggered entrance group');
  assert.ok(!html.includes('data-spotlight-ready'), 'Spotlight enhancement does not alter static no-JavaScript text');
  for (const paragraph of content.about.paragraphs) assert.ok(aboutHtml.includes(paragraph), 'All localized About copy is prerendered');
  assert.ok(html.includes(`aria-label="${content.about.carouselLabel}"`), 'About carousel has a localized accessible name');
  assert.ok(html.includes('data-orbit-entrance="assemble"'), 'Carousel arrival is enhanced independently of its rotation');
  assert.ok(!html.includes('data-entrance="playing"'), 'Cards are never hidden for an entrance in static HTML');
  assert.equal((html.match(/class="about-orbit-card"/g) || []).length, content.about.cards.length, 'Every carousel card is prerendered');
  for (const card of content.about.cards) assert.ok(html.includes(card.description), 'All carousel content remains available without JavaScript');
  assert.ok(html.includes(`aria-label="${content.hero.pauseAnimation}"`));
  assert.ok(html.includes(`aria-label="${content.hero.logoInteraction}"`));
  assert.ok(html.includes(content.hero.rotateHint));
  assert.ok(/<p[^>]*class="sr-only">/.test(html), 'Logo instructions are screen-reader-only');
  assert.ok(html.includes('hero-motion-control sr-only focus:not-sr-only'), 'Motion control stays accessible without a visible pause icon');
  assert.ok(!html.includes('lucide-pause') && !html.includes('lucide-play'), 'Logo block has no pause/play icon');
  assert.ok(!html.includes('lucide-move-horizontal') && !html.includes('>SHV DIGITAL</span>'), 'Logo is displayed without a movement symbol or brand caption');
  assert.ok(!/class="(?:intro-orbit|hero-orbit|hero-grid)/.test(html), 'No detached orbit or grid lines remain');
  assert.ok(html.includes('class="brand-depth"'), 'Original brand mark includes 3D depth layers');
  assert.ok(html.includes('class="hero-slogan'), 'Localized slogan is rendered in the hero');
  assert.ok(html.includes(content.contact.submit));
  assert.ok(html.includes(`name="language" value="${code}"`));
  assert.ok(!html.includes('<!--app-head-->'));
  assert.ok(!html.includes('opacity:0'), 'Prerendered content must not be hidden');
  assert.ok(/hidden="" aria-hidden="true" inert="" class="intro-overlay/.test(html), 'Intro must be hidden and decorative in static HTML');
  assert.ok(html.includes('data-reveal="true"'), 'Entrance animations progressively enhance static content');
  assert.ok(html.includes(`href="/${code}/" hrefLang="${code}" lang="${code}"`));
  assert.ok(html.includes('<details class="language-selector group sm:relative">'), 'Language dropdown is closed by default');
  assert.ok(html.includes(`<summary aria-label="${content.languageLabel}:`), 'Dropdown label is localized');
  assert.ok(html.includes(`aria-label="${content.languageLabel}"`), 'Language navigation is localized');
  assert.equal((html.match(/aria-current="page"/g) || []).length, 1, 'Only the active language is selected');
  assert.ok(html.includes('header-nav-mobile'), 'Section navigation stays available on mobile');
  for (const nav of html.matchAll(/<nav\b[^>]*class="header-nav-(?:desktop|mobile)[^"]*"[^>]*>([\s\S]*?)<\/nav>/g)) {
    assert.deepEqual([...nav[1].matchAll(/href="#([^"]+)"/g)].map((link) => link[1]), ['sobre', 'diferenciais', 'servicos'], 'Desktop and mobile navigation follow page section order');
  }
  assert.ok(html.includes(`aria-label="${content.navigationLabel}"`), 'Header navigation label is localized');
  assert.ok(html.includes('header-contact'), 'Contact link has the non-scaling animated treatment');
  assert.ok(/<a href="#inicio"[^>]*class="header-logo/.test(html), 'Header logo returns to the top through a same-document anchor');
  assert.ok(html.includes('id="inicio"'), 'Top-of-page anchor exists in every language');
  assert.ok(html.includes('language-trigger'), 'Language selector uses the matching header treatment');
  for (const { code: alternate } of locales) assert.ok(html.includes(`href="/${alternate}/"`));
  for (const [, path] of html.matchAll(/(?:src|href)="(\/assets\/[^\"]+)"/g)) await access(`dist${path}`);
}

assert.equal(await readFile('dist/index.html', 'utf8'), await readFile('dist/pt-BR/index.html', 'utf8'));
for (const file of ['sitemap.xml', 'robots.txt', 'logo_square.png', 'flags/br.svg', 'flags/gb.svg', 'flags/es.svg']) await access(`dist/${file}`);
console.log('Built HTML verified: all locales, visible content, metadata, language links and assets.');
