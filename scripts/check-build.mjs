import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { locales, translations } from '../src/i18n.js';

for (const { code } of locales) {
  const html = await readFile(`dist/${code}/index.html`, 'utf8');
  const content = translations[code];
  assert.ok(html.includes(`<html lang="${code}">`));
  assert.equal((html.match(/<title>/g) || []).length, 1);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.ok(html.includes(content.hero.title));
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
  for (const { code: alternate } of locales) assert.ok(html.includes(`href="/${alternate}/"`));
  for (const [, path] of html.matchAll(/(?:src|href)="(\/assets\/[^\"]+)"/g)) await access(`dist${path}`);
}

assert.equal(await readFile('dist/index.html', 'utf8'), await readFile('dist/pt-BR/index.html', 'utf8'));
for (const file of ['sitemap.xml', 'robots.txt', 'logo_square.png', 'flags/br.svg', 'flags/gb.svg', 'flags/es.svg']) await access(`dist/${file}`);
console.log('Built HTML verified: all locales, visible content, metadata, language links and assets.');
