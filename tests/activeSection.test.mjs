import test from 'node:test';
import assert from 'node:assert/strict';
import { getActiveSection } from '../src/utils/activeSection.js';

test('hero has no section highlight before the first section reaches the header', () => {
  assert.equal(getActiveSection([{ id: 'sobre', top: 800 }], 160), '');
  assert.equal(getActiveSection([], 160), '');
});

test('active section follows document order rather than navigation order', () => {
  const sections = [{ id: 'sobre', top: -900 }, { id: 'diferenciais', top: 100 }, { id: 'servicos', top: 900 }, { id: 'contato', top: 1600 }];
  assert.equal(getActiveSection(sections, 160), 'diferenciais');
  assert.equal(getActiveSection(sections, 950), 'servicos');
  assert.equal(getActiveSection(sections, 160, true), 'contato');
});

test('activation threshold adapts to header height and handles an exact boundary', () => {
  assert.equal(getActiveSection([{ id: 'sobre', top: 180 }], 140), '');
  assert.equal(getActiveSection([{ id: 'sobre', top: 180 }], 180), 'sobre');
  assert.equal(getActiveSection([], 180, true), '');
});
