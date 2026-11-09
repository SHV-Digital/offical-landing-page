import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { loadEnv } from 'vite';
import { render } from '../.prerender/prerender.js';
import { locales } from '../src/i18n.js';
import { normalizeSiteUrl, renderSeo, renderSitemap } from '../src/seo.js';

const env = loadEnv('production', process.cwd(), '');
const siteUrl = normalizeSiteUrl(process.env.SITE_URL || env.SITE_URL);
const template = await readFile('dist/index.html', 'utf8');

for (const locale of locales) {
  const html = template
    .replace('<html lang="pt-BR">', `<html lang="${locale.code}">`)
    .replace('<!--app-head-->', renderSeo(`/${locale.code}/`, siteUrl))
    .replace('<div id="root"></div>', () => `<div id="root">${render(locale.code)}</div>`);
  const directory = resolve('dist', locale.code);
  await mkdir(directory, { recursive: true });
  await writeFile(resolve(directory, 'index.html'), html);
  if (locale.code === 'pt-BR') await writeFile('dist/index.html', html);
}

await writeFile('dist/sitemap.xml', renderSitemap(siteUrl));
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
console.log('Prerendered /, /pt-BR/, /en/, /es/ and generated sitemap.xml + robots.txt');
