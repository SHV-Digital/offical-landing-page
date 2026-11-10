import test from 'node:test';
import assert from 'node:assert/strict';
import { translations } from '../src/i18n.js';
import {
  LAUNCH_ORDER, POWER_TIMING, SWIPE_THRESHOLD, accentBackground, entrySide, formatCounter, formatPosition,
  hiddenSide, powerSequenceDuration, shortestDelta, splitEmphasis, splitHeadline, swipeStep, tileSlot, wrapIndex,
} from '../src/utils/aboutStage.js';

test('indices wrap in both directions around six principles', () => {
  assert.equal(wrapIndex(-1, 6), 5);
  assert.equal(wrapIndex(6, 6), 0);
  assert.equal(wrapIndex(13, 6), 1);
});

test('the shortest path around the circle is chosen, forward on a half turn', () => {
  assert.equal(shortestDelta(0, 1, 6), 1);
  assert.equal(shortestDelta(0, 5, 6), -1);
  assert.equal(shortestDelta(5, 0, 6), 1);
  assert.equal(shortestDelta(1, 4, 6), 3);
  assert.equal(shortestDelta(2, 2, 6), 0);
});

test('four tiles flank the monitor, the active one hides behind it and the sixth below', () => {
  assert.deepEqual([0, 1, 2, 3, 4, 5].map((index) => tileSlot(index, 0, 6)), ['0', '1', '2', 'hidden', '-2', '-1']);
  for (let active = 0; active < 6; active++) {
    const slots = [0, 1, 2, 3, 4, 5].map((index) => tileSlot(index, active, 6));
    assert.deepEqual([...slots].sort(), ['-1', '-2', '0', '1', '2', 'hidden']);
    assert.equal(slots[active], '0');
  }
});

test('advancing moves every tile to the next arc position', () => {
  const order = ['hidden', '2', '1', '0', '-1', '-2'];
  for (let index = 0; index < 6; index++) {
    const before = order.indexOf(tileSlot(index, 0, 6));
    const after = order.indexOf(tileSlot(index, 1, 6));
    assert.equal(after, (before + 1) % order.length);
  }
  // The next card's tile enters the monitor; the previous card's reappears on the left.
  assert.equal(tileSlot(1, 1, 6), '0');
  assert.equal(tileSlot(0, 1, 6), '-1');
});

test('the hidden tile leaves on the side it came from and rises on the side of travel', () => {
  assert.equal(hiddenSide(1), 'left');
  assert.equal(hiddenSide(-1), 'right');
  assert.equal(entrySide(1), 'right');
  assert.equal(entrySide(-1), 'left');
});

test('only deliberate horizontal swipes change the card', () => {
  assert.equal(SWIPE_THRESHOLD, 48);
  assert.equal(swipeStep(-60, 10), 1);
  assert.equal(swipeStep(60, -10), -1);
  assert.equal(swipeStep(-47, 0), 0);
  assert.equal(swipeStep(-60, 80), 0, 'vertical scrolling wins');
  assert.equal(swipeStep(60, 60), 0);
});

test('counter and position labels are zero-padded and localized', () => {
  assert.equal(formatCounter(3, 6), '03 / 06');
  assert.equal(formatPosition('Princípio {current} de {total}', 3, 6), 'Princípio 3 de 6');
});

test('emphasis and headline splits keep every character in reading order', () => {
  assert.deepEqual(splitEmphasis('Qualidade NÃO é negociável', 'NÃO'), [
    { text: 'Qualidade ', emphasis: false }, { text: 'NÃO', emphasis: true }, { text: ' é negociável', emphasis: false },
  ]);
  assert.deepEqual(splitEmphasis('Movidos por Desafios'), [{ text: 'Movidos por Desafios', emphasis: false }]);
  assert.deepEqual(splitHeadline('Quem somos nós?'), { lead: 'Quem', accent: ['somos', 'nós?'] });
  assert.deepEqual(splitHeadline('¿Quiénes somos?'), { lead: '¿Quiénes', accent: ['somos?'] });
  assert.deepEqual(accentBackground(1, 2), { backgroundSize: '200% 100%', backgroundPosition: '100% 0' });
  assert.deepEqual(accentBackground(0, 1), { backgroundSize: '100% 100%', backgroundPosition: '0% 0' });
});

test('power-on runs screen, glow, tiles, then title within 1.6–2 seconds', () => {
  assert.ok(POWER_TIMING.screen <= POWER_TIMING.glowDelay + POWER_TIMING.glow);
  assert.ok(POWER_TIMING.glowDelay < POWER_TIMING.screen, 'light spills onto the stage as the screen finishes');
  assert.ok(POWER_TIMING.tilesDelay > POWER_TIMING.glowDelay);
  assert.ok(POWER_TIMING.titleDelay > POWER_TIMING.tilesDelay);
  assert.equal(POWER_TIMING.tileStagger, 70);
  assert.deepEqual(LAUNCH_ORDER, ['1', '-1', '2', '-2'], 'inner tiles launch before outer ones');
  for (const { about } of Object.values(translations)) {
    const words = about.headline.split(/\s+/).length;
    const total = powerSequenceDuration(POWER_TIMING, words);
    assert.ok(total >= 1600 && total <= 2000, `${about.headline}: ${total}ms`);
  }
});

test('every locale has the same six principles with an emphasis present in its title', () => {
  const ids = translations['pt-BR'].about.principles.map(({ id }) => id);
  assert.equal(ids.length, 6);
  for (const { about } of Object.values(translations)) {
    assert.deepEqual(about.principles.map(({ id }) => id), ids);
    for (const principle of about.principles) {
      assert.ok(principle.title && principle.description);
      if (principle.emphasis) assert.ok(principle.title.includes(principle.emphasis));
    }
    assert.ok(about.positionLabel.includes('{current}') && about.positionLabel.includes('{total}'));
    assert.ok(about.tagline && about.headline.trim().split(/\s+/).length >= 2);
  }
});
