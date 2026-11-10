export const CONTACT_FLOW_DURATION = 9000;
export const CONTACT_FLOW_NODES = [0.02, 0.22, 0.42];
export const CONTACT_FLOW_BRIDGE = [0.47, 0.72];
export const CONTACT_FLOW_BUTTON = [0.72, 0.88];

// A quiet interval around each passage keeps the loop reset invisible.
export function contactFlowWindow(start, end, from, peak, to = from) {
  return [
    { ...from, offset: 0 },
    { ...from, offset: start },
    { ...peak, offset: start + (end - start) * 0.3 },
    { ...peak, offset: start + (end - start) * 0.65 },
    { ...to, offset: end },
    { ...to, offset: 1 },
  ];
}

export function contactBridgePath(icon, journey, form, button, bounds, stacked) {
  const x = icon.left + icon.width / 2 - bounds.left;
  const y = icon.bottom - bounds.top;
  const bottom = journey.bottom - bounds.top + 14;
  // The mobile lane sits outside the card, never beside its field labels.
  const lane = stacked ? form.left - bounds.left - 12 : (journey.right + form.left) / 2 - bounds.left;
  const endX = button.left - bounds.left;
  const endY = button.top + button.height / 2 - bounds.top;
  const horizontal = lane > x ? 1 : -1;
  const vertical = endY > bottom ? 1 : -1;
  const radius = Math.min(14, Math.abs(lane - x) / 2, Math.abs(endY - bottom) / 2);
  return `M ${x} ${y} V ${bottom - radius} Q ${x} ${bottom} ${x + horizontal * radius} ${bottom} H ${lane - horizontal * radius} Q ${lane} ${bottom} ${lane} ${bottom + vertical * radius} V ${endY - vertical * radius} Q ${lane} ${endY} ${lane + radius} ${endY} H ${endX}`;
}
