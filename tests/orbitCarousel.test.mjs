import test from 'node:test';
import assert from 'node:assert/strict';
import { nearestOrbitAngle, orbitPosition, wrapIndex } from '../src/utils/orbitCarousel.js';

test('carousel indices wrap in either direction', () => {
  assert.equal(wrapIndex(-1, 3), 2);
  assert.equal(wrapIndex(3, 3), 0);
  assert.equal(wrapIndex(7, 3), 1);
});

test('selecting a card takes the shortest path around the orbit', () => {
  assert.ok(Math.abs(nearestOrbitAngle(0, 2, 3)) < Math.PI);
  const angle = -Math.PI * 8;
  assert.ok(Math.abs(nearestOrbitAngle(angle, 1, 3) - angle) <= Math.PI);
});

test('cards stay opaque while depth is conveyed by scale and surface shade', () => {
  const front = orbitPosition(0, 0, 3, 120, 80);
  assert.equal(front.x, 0);
  assert.equal(front.y, 80);
  assert.equal(front.scale, 1);
  assert.equal(front.opacity, 1);
  const side = orbitPosition(0, 1, 3, 120, 80);
  assert.ok(side.x > 0 && side.x <= 120);
  assert.ok(side.scale < front.scale && side.shade > front.shade);
  assert.equal(side.opacity, 1);
  assert.ok(side.zIndex < front.zIndex);
});

test('crossing cards use separate vertical lanes rather than the same plane', () => {
  const first = orbitPosition(-Math.PI / 3, 0, 3, 120, 80);
  const second = orbitPosition(-Math.PI / 3, 1, 3, 120, 80);
  assert.ok(Math.abs(first.y - second.y) > 50);
  assert.equal(first.opacity, 1);
  assert.equal(second.opacity, 1);
});

test('a full rotation returns each card to the same position', () => {
  for (let index = 0; index < 3; index++) {
    const start = orbitPosition(0, index, 3, 120, 80);
    const end = orbitPosition(Math.PI * 2, index, 3, 120, 80);
    assert.ok(Math.abs(start.x - end.x) < 0.000001);
    assert.ok(Math.abs(start.y - end.y) < 0.000001);
  }
});
