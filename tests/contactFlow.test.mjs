import test from 'node:test';
import assert from 'node:assert/strict';
import { CONTACT_FLOW_NODES, CONTACT_FLOW_BRIDGE, CONTACT_FLOW_BUTTON, contactBridgePath, contactFlowWindow } from '../src/utils/contactFlow.js';

test('contact light visits the three nodes, then the bridge, then the submit button', () => {
  assert.ok(CONTACT_FLOW_NODES[0] < CONTACT_FLOW_NODES[1]);
  assert.ok(CONTACT_FLOW_NODES[1] < CONTACT_FLOW_NODES[2]);
  assert.ok(CONTACT_FLOW_NODES[2] < CONTACT_FLOW_BRIDGE[0]);
  assert.equal(CONTACT_FLOW_BRIDGE[1], CONTACT_FLOW_BUTTON[0]);
  assert.ok(CONTACT_FLOW_BUTTON[1] < 1);
  const frames = contactFlowWindow(...CONTACT_FLOW_BUTTON, { opacity: 0 }, { opacity: 1 });
  assert.equal(frames[0].opacity, 0);
  assert.equal(frames.at(-1).opacity, 0);
  assert.ok(frames.every((frame, index) => index === 0 || frame.offset >= frames[index - 1].offset));
});

test('contact connector reaches the button with rounded bends and an outside mobile lane', () => {
  const form = { left: 560 };
  const button = { left: 590, top: 420, height: 54 };
  const bounds = { left: 10, top: 10 };
  const icon = { left: 20, width: 42, bottom: 400 };
  const journey = { right: 500, bottom: 480 };
  const desktop = contactBridgePath(icon, journey, form, button, bounds, false);
  assert.match(desktop, /^M 31 390 V .* H 580$/);
  assert.equal((desktop.match(/ Q /g) || []).length, 3);
  const mobile = contactBridgePath(icon, journey, { left: 10 }, { left: 34, top: 900, height: 54 }, bounds, true);
  assert.match(mobile, /Q -12 484 -12 498/);
  assert.match(mobile, /H 24$/);
});
