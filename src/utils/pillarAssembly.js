// Contiguous crops of the original SHV logo: assembling the pillars restores
// every pixel of the actual mark, rather than approximating it with a new S.
export const PILLAR_LOGO = '/logo_square.png';
export const PILLAR_SLICES = [
  { top: 0, bottom: 130, x: 75, y: -65, rotate: 3 },
  { top: 130, bottom: 260, x: -60, y: -25, rotate: -3 },
  { top: 260, bottom: 390, x: 48, y: 25, rotate: 3 },
  { top: 390, bottom: 520, x: -75, y: 65, rotate: -3 },
];
export const PILLAR_CONNECTIONS = [
  'M 580 130 H 720 Q 740 130 740 110 H 790',
  'M 410 230 H 365 Q 345 230 345 190 H 310',
  'M 690 370 H 720 Q 740 370 740 420 H 790',
  'M 560 475 H 365 Q 345 475 345 450 H 310',
];
export const PILLAR_ANCHORS = [{ x: 285, y: 95 }, { x: 80, y: 220 }, { x: 435, y: 335 }, { x: 270, y: 455 }];
export function pillarConnection(start, end) {
  const round = (value) => Math.round(value * 10) / 10;
  const middle = round((start.x + end.x) / 2);
  return `M ${round(start.x)} ${round(start.y)} C ${middle} ${round(start.y)} ${middle} ${round(end.y)} ${round(end.x)} ${round(end.y)}`;
}
export const PILLAR_TIMING = { duration: 2600, stagger: 220 };
