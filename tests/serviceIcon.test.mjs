import assert from 'node:assert/strict';
import test from 'node:test';
import { serviceIconPose } from '../src/utils/serviceIcon.js';

const bounds = { left: 100, top: 200, width: 60, height: 60 };
test('detail icon follows pointer position with a bounded 3D tilt', () => {
  assert.deepEqual(serviceIconPose(160, 200, bounds), { rotateX: 12, rotateY: 12, x: 100, y: 0 });
  assert.deepEqual(serviceIconPose(-1000, 2000, bounds), { rotateX: -12, rotateY: -12, x: 0, y: 100 });
  const center = serviceIconPose(130, 230, bounds);
  assert.equal(Math.abs(center.rotateX), 0);
  assert.equal(Math.abs(center.rotateY), 0);
  assert.equal(center.x, 50);
  assert.equal(center.y, 50);
});
test('collapsed icon bounds never produce invalid pointer styles', () => {
  const pose = serviceIconPose(10, 10, { left: 0, top: 0, width: 0, height: 0 });
  assert.ok(Object.values(pose).every(Number.isFinite));
});
