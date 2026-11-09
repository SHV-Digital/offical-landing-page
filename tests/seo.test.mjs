import test from 'node:test';
import assert from 'node:assert/strict';
import { getLocale, locales, translations } from '../src/i18n.js';
import { normalizeSiteUrl, renderSeo, renderSitemap } from '../src/seo.js';

test('URL locale detection is deterministic and case-insensitive', () => {
  for (const path of ['/', '/pt-BR/', '/PT-br', '/unknown/']) assert.equal(getLocale(path).code, 'pt-BR');
  assert.equal(getLocale('/EN/').code, 'en');
  assert.equal(getLocale('/es').code, 'es');
  assert.equal(getLocale('/english/').code, 'pt-BR');
});

test('all translations have the same structure and nonempty strings', () => {
  function shape(value) {
    if (typeof value === 'string') {
      assert.ok(value.trim());
      return 'string';
    }
    if (Array.isArray(value)) return value.map(shape);
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)]));
  }
  for (const { code } of locales) assert.deepEqual(shape(translations[code]), shape(translations['pt-BR']));
});

test('every locale has unique metadata, canonical, alternates, logo and valid structured data', () => {
  for (const locale of locales) {
    const html = renderSeo(`/${locale.code}/`, 'https://example.com');
    assert.ok(html.includes(`<title>${translations[locale.code].title}</title>`));
    assert.ok(html.includes(`rel="canonical" href="https://example.com/${locale.code}/"`));
    assert.ok(html.includes(`property="og:locale" content="${locale.og}"`));
    assert.ok(html.includes('content="https://example.com/logo_square.png"'));
    assert.equal((html.match(/hreflang=/g) || []).length, 4);
    const data = JSON.parse(html.match(/application\/ld\+json">(.*?)<\/script>/s)[1]);
    assert.equal(data['@graph'][2].inLanguage, locale.code);
  }
});

test('site origin is validated and sitemap lists all canonical pages', () => {
  assert.equal(normalizeSiteUrl('https://example.com/'), 'https://example.com');
  assert.throws(() => normalizeSiteUrl('https://example.com/subpath'));
  assert.throws(() => normalizeSiteUrl('javascript:alert(1)'));
  const sitemap = renderSitemap('https://example.com');
  assert.equal((sitemap.match(/<url>/g) || []).length, 3);
  for (const { code } of locales) assert.ok(sitemap.includes(`<loc>https://example.com/${code}/</loc>`));
});

test('the official public domain works without SITE_URL or with an empty value', () => {
  for (const value of [undefined, '']) {
    assert.equal(normalizeSiteUrl(value), 'https://shvdigital.com.br');
    const html = renderSeo('/en/', value);
    assert.ok(html.includes('rel="canonical" href="https://shvdigital.com.br/en/"'));
    assert.ok(html.includes('content="https://shvdigital.com.br/logo_square.png"'));
    assert.ok(renderSitemap(value).includes('<loc>https://shvdigital.com.br/pt-BR/</loc>'));
  }
});
