import test from 'node:test';
import assert from 'node:assert/strict';
import { dragRotation, keyboardRotation } from '../src/utils/logoRotation.js';

test('drag rotates from the existing position rather than resetting it', () => {
  assert.deepEqual(dragRotation({ pitch: 10, yaw: 45 }, 100, 50), { pitch: -5, yaw: 95 });
  assert.deepEqual(dragRotation({ pitch: -5, yaw: 95 }, -40, -10), { pitch: -2, yaw: 75 });
});

test('rotation stays bounded during long drags', () => {
  assert.deepEqual(dragRotation({ pitch: 0, yaw: 0 }, 2000, 1000), { pitch: -55, yaw: 280 });
  assert.deepEqual(dragRotation({ pitch: 0, yaw: 0 }, -2000, -1000), { pitch: 55, yaw: -280 });
});

test('keyboard can rotate, reset, and ignore unrelated keys', () => {
  const initial = { pitch: 0, yaw: 0 };
  assert.deepEqual(keyboardRotation(initial, 'ArrowLeft'), { pitch: 0, yaw: -15 });
  assert.deepEqual(keyboardRotation(initial, 'ArrowRight'), { pitch: 0, yaw: 15 });
  assert.deepEqual(keyboardRotation(initial, 'ArrowUp'), { pitch: -10, yaw: 0 });
  assert.deepEqual(keyboardRotation(initial, 'ArrowDown'), { pitch: 10, yaw: 0 });
  assert.deepEqual(keyboardRotation({ pitch: 55, yaw: 120 }, 'Home'), initial);
  assert.deepEqual(keyboardRotation({ pitch: 55, yaw: 0 }, 'ArrowDown'), { pitch: 55, yaw: 0 });
  assert.equal(keyboardRotation(initial, 'Tab'), null);
  assert.deepEqual(initial, { pitch: 0, yaw: 0 });
});
