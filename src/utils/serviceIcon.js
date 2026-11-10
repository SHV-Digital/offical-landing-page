export function serviceIconPose(x, y, bounds) {
  const clamp = (value) => Math.max(-1, Math.min(1, value));
  const horizontal = bounds.width > 0 ? clamp((x - bounds.left) / bounds.width * 2 - 1) : 0;
  const vertical = bounds.height > 0 ? clamp((y - bounds.top) / bounds.height * 2 - 1) : 0;
  return { rotateX: -vertical * 12, rotateY: horizontal * 12, x: (horizontal + 1) * 50, y: (vertical + 1) * 50 };
}
