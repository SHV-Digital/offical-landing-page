import assert from 'node:assert/strict';
import test from 'node:test';
import { CLOCKWISE_ORDER, LAYOUTS, STAGGER_MS, TRAVEL_MS, arrivalDelay, buildCircuit } from '../src/utils/serviceCircuit.js';

const segments = (points) => points.slice(1).map((point, index) => [points[index], point]);
const straightOrDiagonal = ([[x1, y1], [x2, y2]]) => {
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  return (dx === 0 || dy === 0 || dx === dy) && dx + dy > 0;
};

for (const [name, layout] of Object.entries(LAYOUTS)) {
  const circuit = buildCircuit(layout);

  test(`${name}: every service has its own trace from a core pin to its chip`, () => {
    assert.equal(circuit.mains.length, 4);
    assert.equal(new Set(circuit.mains.map((main) => main.d)).size, 4);
    circuit.mains.forEach((main, index) => {
      const [startX, startY] = main.points[0];
      assert.equal(Math.abs(startX - circuit.center.x), layout.core / 2 + layout.pin, 'starts at the tip of a side pin');
      assert.ok(Math.abs(startY - circuit.center.y) < layout.core / 2, 'the pin sits on the core side');
      const [endX, endY] = main.points.at(-1);
      const chip = circuit.chips[index];
      assert.ok(Math.abs(endX - chip.x) < layout.chip.width / 2 && Math.abs(endY - chip.y) < layout.chip.height / 2, 'ends under its own chip');
    });
  });

  test(`${name}: traces only use straight runs and 45° diagonals inside the board`, () => {
    const lines = [...circuit.mains.map((main) => main.points), ...circuit.branches];
    lines.forEach((points) => {
      assert.ok(segments(points).every(straightOrDiagonal));
      points.forEach(([x, y]) => assert.ok(x > 0 && x < circuit.width && y > 0 && y < circuit.height));
    });
  });

  test(`${name}: chips sit in the four quadrants around a centered core`, () => {
    const [topLeft, topRight, bottomLeft, bottomRight] = circuit.chips;
    assert.ok(topLeft.x < circuit.center.x && topLeft.y < circuit.center.y);
    assert.ok(topRight.x > circuit.center.x && topRight.y < circuit.center.y);
    assert.ok(bottomLeft.x < circuit.center.x && bottomLeft.y > circuit.center.y);
    assert.ok(bottomRight.x > circuit.center.x && bottomRight.y > circuit.center.y);
    assert.ok(circuit.points.some((point) => point.blink) && circuit.points.some((point) => !point.blink), 'only some solder points twinkle');
  });
}

test('pulses reach chips after the travel time, staggered clockwise when all are activated', () => {
  assert.deepEqual(CLOCKWISE_ORDER, [0, 1, 3, 2]);
  assert.equal(arrivalDelay(2, false, false), TRAVEL_MS);
  assert.deepEqual([0, 1, 3, 2].map((index) => arrivalDelay(index, true, false)), [0, 1, 2, 3].map((step) => TRAVEL_MS + step * STAGGER_MS));
  assert.equal(arrivalDelay(3, true, true), 0);
});

test('standby runner follows its trace in board percentages and rests after travelling', async () => {
  const { runnerFrames } = await import('../src/utils/serviceCircuit.js');
  const frames = runnerFrames([[0, 0], [30, 0], [30, 40]], 100, 200, 0.5);
  assert.deepEqual(frames.map((frame) => frame.offset), [0, 0.2143, 0.5, 1]);
  assert.equal(frames[1].transform, 'translate3d(30%, 0%, 3px)');
  assert.equal(frames[2].transform, 'translate3d(30%, 20%, 3px)');
  assert.deepEqual(frames.map((frame) => frame.opacity), [0, 1, 0, 0]);
});
