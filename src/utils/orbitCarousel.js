export const ORBIT_TIMING = Object.freeze({ dwell: 4200, automatic: 1600, manual: 1100 });

export function wrapIndex(index, count) {
  return ((index % count) + count) % count;
}

export function nearestOrbitAngle(angle, index, count) {
  const target = -index * Math.PI * 2 / count;
  return target + Math.round((angle - target) / (Math.PI * 2)) * Math.PI * 2;
}

export function orbitPosition(angle, index, count, radiusX, radiusY) {
  const theta = angle + index * Math.PI * 2 / count;
  const depth = (Math.cos(theta) + 1) / 2;
  return {
    x: Math.sin(theta) * radiusX * (1 + (1 - depth) * 0.12),
    // An inclined orbit separates the crossing cards into upper/lower lanes.
    y: (Math.cos(theta) + Math.sin(theta) * 0.6) * radiusY,
    scale: 0.68 + depth * 0.32,
    // Keep surfaces opaque so the rear cards never show through the front one.
    opacity: 1,
    shade: (1 - depth) * 0.3,
    blur: Math.pow(1 - depth, 1.5) * 1.8,
    front: Math.max(0, (depth - 0.45) / 0.55),
    roll: Math.sin(theta) * 2.5,
    tilt: -Math.sin(theta) * 14,
    zIndex: Math.round(depth * 100),
  };
}
