import assert from 'node:assert/strict';
import test from 'node:test';
import { PILLAR_ANCHORS, PILLAR_CONNECTIONS, PILLAR_LOGO, PILLAR_SLICES, PILLAR_TIMING, pillarConnection } from '../src/utils/pillarAssembly.js';

test('four contiguous pillars reassemble the original SHV logo without gaps or lost pixels', () => {
  assert.equal(PILLAR_SLICES.length, 4);
  assert.equal(PILLAR_LOGO, '/logo_square.png');
  assert.equal(PILLAR_SLICES[0].top, 0);
  assert.equal(PILLAR_SLICES.at(-1).bottom, 520);
  PILLAR_SLICES.forEach((slice, index) => {
    assert.ok(slice.bottom > slice.top);
    assert.ok(Object.values(slice).every(Number.isFinite));
    if (index) assert.equal(slice.top, PILLAR_SLICES[index - 1].bottom);
  });
});

test('pillars approach from alternating sides and have distinct connectors', () => {
  assert.deepEqual(PILLAR_SLICES.map(({ x }) => Math.sign(x)), [1, -1, 1, -1]);
  assert.equal(PILLAR_CONNECTIONS.length, PILLAR_SLICES.length);
  assert.equal(new Set(PILLAR_CONNECTIONS).size, 4);
  assert.equal(PILLAR_TIMING.duration, 2600);
  assert.ok(PILLAR_TIMING.duration + PILLAR_TIMING.stagger * 3 < 3500);
});

test('measured connectors terminate exactly at their icon-side endpoints', () => {
  assert.equal(PILLAR_ANCHORS.length, 4);
  assert.equal(pillarConnection({ x: 420, y: 190 }, { x: 300, y: 230 }), 'M 420 190 C 360 190 360 230 300 230');
  assert.equal(pillarConnection({ x: 600, y: 130 }, { x: 800, y: 80 }), 'M 600 130 C 700 130 700 80 800 80');
});
