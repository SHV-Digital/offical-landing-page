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
    x: Math.sin(theta) * radiusX,
    // An inclined orbit separates the crossing cards into upper/lower lanes.
    y: (Math.cos(theta) + Math.sin(theta) * 0.45) * radiusY,
    scale: 0.72 + depth * 0.28,
    // Keep surfaces opaque so the rear cards never show through the front one.
    opacity: 1,
    shade: (1 - depth) * 0.48,
    front: Math.max(0, (depth - 0.45) / 0.55),
    roll: Math.sin(theta) * 2.5,
    tilt: -Math.sin(theta) * 18,
    zIndex: Math.round(depth * 100),
  };
}
