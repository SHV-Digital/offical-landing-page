import assert from 'node:assert/strict';
import test from 'node:test';
import { ENTRANCE_IDLE_MS, holdEntrance, isEntranceVisible, observeSettledEntrance } from '../src/utils/settledEntrance.js';

test('prepared entrances hold their first frame instead of flashing the finished pose', () => {
  const animation = { currentTime: null, pause() { this.paused = true; } };
  assert.equal(holdEntrance(animation), animation);
  assert.equal(animation.paused, true);
  assert.equal(animation.currentTime, 0);
});

const rect = (top, height, left = 0, width = 600) => ({ top, bottom: top + height, height, left, right: left + width, width });
const viewport = { width: 1000, height: 800 };

test('entrance needs meaningful visibility below the fixed header', () => {
  assert.equal(isEntranceVisible(rect(750, 400), viewport, 100), false);
  assert.equal(isEntranceVisible(rect(-350, 400), viewport, 100), false);
  assert.equal(isEntranceVisible(rect(200, 400), viewport, 100), true);
  assert.equal(isEntranceVisible(rect(200, 400, 950), viewport, 100), false);
});

test('tall mobile content can enter without fitting the entire section', () => {
  assert.equal(isEntranceVisible(rect(180, 1400), { width: 375, height: 700 }, 150), true);
  assert.equal(isEntranceVisible(rect(650, 1400), { width: 375, height: 700 }, 150), false);
  assert.equal(isEntranceVisible(rect(100, 0), viewport, 100), false);
});

test('waiting restarts during scrolling, rechecks visibility, and plays only once', async () => {
  const original = { window: globalThis.window, document: globalThis.document, IntersectionObserver: globalThis.IntersectionObserver };
  const events = () => {
    const listeners = new Map();
    return {
      addEventListener: (type, callback) => listeners.set(type, callback),
      removeEventListener: (type) => listeners.delete(type),
      fire: (type) => listeners.get(type)?.(),
      count: () => listeners.size,
    };
  };
  const windowEvents = events();
  const documentEvents = events();
  const timers = new Map();
  let nextTimer = 0;
  let intersection;
  let disconnected = false;
  let bounds = rect(750, 400);
  let plays = 0;
  const flush = () => {
    const callbacks = [...timers.values()];
    timers.clear();
    callbacks.forEach((callback) => callback());
  };
  try {
    globalThis.window = {
      ...windowEvents, innerWidth: 1000, innerHeight: 800,
      setTimeout: (callback, delay) => { assert.equal(delay, ENTRANCE_IDLE_MS); timers.set(++nextTimer, callback); return nextTimer; },
      clearTimeout: (id) => timers.delete(id),
    };
    globalThis.document = { ...documentEvents, hidden: false, querySelector: () => ({ getBoundingClientRect: () => ({ bottom: 100 }) }) };
    globalThis.IntersectionObserver = class {
      constructor(callback) { intersection = callback; }
      observe() {}
      disconnect() { disconnected = true; }
    };
    const stop = observeSettledEntrance({ getBoundingClientRect: () => bounds }, () => plays++);
    await Promise.resolve();
    flush();
    assert.equal(plays, 0, 'A sliver of content must not consume its entrance');
    bounds = rect(200, 400);
    intersection();
    const oldTimer = nextTimer;
    windowEvents.fire('scroll');
    assert.equal(timers.has(oldTimer), false, 'Scroll cancels the pending start');
    assert.equal(plays, 0);
    windowEvents.fire('scrollend');
    assert.equal(timers.size, 1);
    flush();
    assert.equal(plays, 1);
    assert.equal(disconnected, true);
    assert.equal(windowEvents.count(), 0);
    assert.equal(documentEvents.count(), 0);
    intersection();
    flush();
    assert.equal(plays, 1);
    stop();

    const cancel = observeSettledEntrance({ getBoundingClientRect: () => bounds }, () => plays++);
    document.hidden = true;
    documentEvents.fire('visibilitychange');
    flush();
    assert.equal(plays, 1, 'Hidden pages do not consume an entrance');
    document.hidden = false;
    documentEvents.fire('visibilitychange');
    cancel();
    await Promise.resolve();
    flush();
    assert.equal(plays, 1, 'Cleanup cancels timers and late font readiness');
  } finally {
    for (const [name, value] of Object.entries(original)) {
      if (value === undefined) delete globalThis[name];
      else globalThis[name] = value;
    }
  }
});
