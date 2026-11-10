// Pure helpers for the About stage: a circular carousel whose tiles orbit a
// code-drawn monitor. Visual poses for every slot live in CSS (`data-slot`), so
// prerendered HTML is already laid out in its final state without JavaScript.

export const SWIPE_THRESHOLD = 48;
// Delay between the single steps of a multi-step jump (for example, clicking
// the far tile), so every tile still travels to the next arc position in turn.
export const STEP_GAP_MS = 170;

// Power-on sequence (ms from the moment the stage enters view). CSS mirrors
// these values; tests guard the 1.6–2s total and the order of the phases.
export const POWER_TIMING = Object.freeze({
  screen: 450,
  glowDelay: 260,
  glow: 700,
  tilesDelay: 560,
  tileStagger: 70,
  tile: 820,
  titleDelay: 900,
  wordStagger: 90,
  word: 700,
});

// Tiles launch from behind the monitor, inner pair first, then the outer pair.
export const LAUNCH_ORDER = Object.freeze(['1', '-1', '2', '-2']);

export function wrapIndex(index, count) {
  return ((index % count) + count) % count;
}

// Signed distance from `from` to `to` around the circle, preferring forward
// movement on an exact half turn.
export function shortestDelta(from, to, count) {
  const forward = wrapIndex(to - from, count);
  return forward > count / 2 ? forward - count : forward;
}

// Slot of a tile relative to the active card: '0' sits behind the monitor,
// '1'/'2' to the right, '-1'/'-2' to the left, and 'hidden' below the stage.
export function tileSlot(index, active, count) {
  const offset = shortestDelta(active, index, count);
  return Math.abs(offset) > 2 ? 'hidden' : String(offset);
}

// After a step in `direction`, the tile that became hidden came from this side.
export function hiddenSide(direction) {
  return direction > 0 ? 'left' : 'right';
}

// A hidden tile re-enters the arc on the side the carousel is moving towards.
export function entrySide(direction) {
  return direction > 0 ? 'right' : 'left';
}

// Horizontal swipes beyond the threshold change the card; vertical movement
// stays with page scrolling. Swiping left reveals the next card.
export function swipeStep(dx, dy, threshold = SWIPE_THRESHOLD) {
  if (Math.abs(dx) < threshold || Math.abs(dx) <= Math.abs(dy)) return 0;
  return dx < 0 ? 1 : -1;
}

export function formatCounter(current, total) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${pad(current)} / ${pad(total)}`;
}

export function formatPosition(template, current, total) {
  return template.replace('{current}', String(current)).replace('{total}', String(total));
}

// Split a title around its emphasised word so only that word gets the gradient.
export function splitEmphasis(title, emphasis) {
  const start = emphasis ? title.indexOf(emphasis) : -1;
  if (start < 0) return [{ text: title, emphasis: false }];
  return [
    { text: title.slice(0, start), emphasis: false },
    { text: emphasis, emphasis: true },
    { text: title.slice(start + emphasis.length), emphasis: false },
  ].filter((part) => part.text);
}

// The first word of the headline stays white; the rest carries the gradient.
export function splitHeadline(headline) {
  const [lead, ...accent] = headline.trim().split(/\s+/);
  return { lead, accent };
}

// Slice one continuous gradient across the accent words so it reads as a
// single sweep even though each word animates (and clips) on its own.
export function accentBackground(index, count) {
  return {
    backgroundSize: `${count * 100}% 100%`,
    backgroundPosition: `${count > 1 ? (index / (count - 1)) * 100 : 0}% 0`,
  };
}

export function powerSequenceDuration(timing = POWER_TIMING, words = 3) {
  const tiles = timing.tilesDelay + (LAUNCH_ORDER.length - 1) * timing.tileStagger + timing.tile;
  const title = timing.titleDelay + (words - 1) * timing.wordStagger + timing.word;
  return Math.max(timing.screen, timing.glowDelay + timing.glow, tiles, title);
}
