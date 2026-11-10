const clamp = (value) => Math.max(-1, Math.min(1, value));

// Pointer position across the stage as -1..1 on both axes (0 at its center).
export function boardPointerTarget(x, y, bounds) {
  if (!(bounds.width > 0) || !(bounds.height > 0)) return { x: 0, y: 0 };
  return {
    x: clamp((x - bounds.left - bounds.width / 2) / (bounds.width / 2)),
    y: clamp((y - bounds.top - bounds.height / 2) / (bounds.height / 2)),
  };
}

// Pointer position in the board's own (untransformed) pixel space, or null
// when the pointer is not over the board. `offsetX/Y` are already local to the
// tilted target, so no matrix maths is needed; chips are centered on their
// `left/top`, which `offsetLeft/Top` report without the centering transform.
export function boardSpotPosition(event) {
  const target = event.target;
  if (!target?.closest) return null;
  if (target.closest('.processor-surface')) return { x: event.offsetX, y: event.offsetY };
  const chip = target.closest('.service-chip, .processor-core');
  if (!chip) return null;
  return {
    x: chip.offsetLeft - chip.offsetWidth / 2 + event.offsetX,
    y: chip.offsetTop - chip.offsetHeight / 2 + event.offsetY,
  };
}
