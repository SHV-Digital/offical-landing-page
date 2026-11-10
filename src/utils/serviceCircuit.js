// Geometry for the Services circuit board. Every trace is described once, in
// offsets from the core for the bottom-right quadrant, then mirrored to the
// other three. Segments are only horizontal, vertical or 45° diagonals.

// Service order on the board: 0 top-left, 1 top-right, 2 bottom-left,
// 3 bottom-right. Clockwise activation order starts at the top-left chip.
export const CLOCKWISE_ORDER = [0, 1, 3, 2];
export const TRAVEL_MS = 600;
export const STAGGER_MS = 150;

const quadrant = (index) => ({ sx: index % 2 === 0 ? -1 : 1, sy: index < 2 ? -1 : 1 });

// `only` limits a template that sits on a mirror axis to one side of it;
// `skip` drops one quadrant so the board is not perfectly symmetrical.
export const LAYOUTS = {
  // Landscape board for wide stages.
  wide: {
    width: 800,
    height: 640,
    core: 140,
    pin: 14,
    chip: { width: 220, height: 140, dx: 230, dy: 185 },
    main: { port: 24, run: 250, rise: 40 },
    pins: [-48, -24, 0, 24, 48],
    aux: [
      { points: [[84, 0], [300, 0], [340, 0]], only: 'y' },
      { points: [[300, 0], [330, 30], [384, 30]], only: 'y', skip: 0 },
      { points: [[84, 48], [196, 48], [224, 76], [252, 76]] },
      { points: [[0, 84], [0, 300]], only: 'x' },
      { points: [[24, 84], [24, 150], [54, 180], [54, 292]], skip: 1 },
      { points: [[48, 84], [48, 110], [88, 150], [88, 236]] },
      { points: [[366, 56], [366, 150], [382, 166], [382, 250]], skip: 2 },
      { points: [[340, 185], [358, 185]] },
      { points: [[340, 222], [350, 222], [366, 238], [366, 296]], skip: 3 },
      { points: [[200, 255], [200, 284], [216, 300], [300, 300]] },
      { points: [[262, 255], [262, 280]], skip: 0 },
    ],
  },
  // Portrait board: mobile, and narrower desktop stages.
  tall: {
    width: 400,
    height: 560,
    core: 88,
    pin: 10,
    chip: { width: 176, height: 140, dx: 96, dy: 168 },
    main: { port: 14, run: 110, rise: 40 },
    pins: [-28, -14, 0, 14, 28],
    aux: [
      { points: [[54, 0], [120, 0], [152, 0]], only: 'y' },
      { points: [[120, 0], [140, 20], [188, 20]], only: 'y', skip: 1 },
      { points: [[54, 28], [78, 28], [100, 50], [100, 112]], skip: 2 },
      { points: [[0, 54], [0, 268]], only: 'x' },
      { points: [[28, 54], [28, 112]] },
      { points: [[176, 72], [176, 38], [190, 24]], skip: 0 },
      { points: [[60, 238], [60, 256], [70, 266], [132, 266]] },
      { points: [[152, 238], [152, 260]], skip: 3 },
    ],
  },
};

const toPath = (points) => `M ${points.map(([x, y]) => `${x} ${y}`).join(' L ')}`;

export function buildCircuit(layout) {
  const { width, height, core, pin, chip, main, pins, aux } = layout;
  const center = { x: width / 2, y: height / 2 };
  const reach = core / 2 + pin;
  const place = ([x, y], { sx, sy }) => [center.x + sx * x, center.y + sy * y];

  const mains = [0, 1, 2, 3].map((index) => {
    const side = quadrant(index);
    const entry = main.run + main.rise;
    const edge = chip.dy - chip.height / 2;
    const points = [
      [reach, main.port],
      [main.run, main.port],
      [entry, main.port + main.rise],
      [entry, edge],
      // Tucked under the chip so the trace always meets its body.
      [entry, edge + 16],
    ].map((point) => place(point, side));
    return { d: toPath(points), points, pad: points[3], corners: [points[1], points[2]] };
  });

  const branches = [];
  const points = [];
  aux.forEach((template, templateIndex) => {
    [0, 1, 2, 3].forEach((index) => {
      const side = quadrant(index);
      if (template.skip === index) return;
      if (template.only === 'y' && side.sy < 0) return;
      if (template.only === 'x' && side.sx < 0) return;
      const placed = template.points.map((point) => place(point, side));
      branches.push(placed);
      const [x, y] = placed[placed.length - 1];
      // A sparse, repeatable third of the solder points twinkles.
      const seed = templateIndex * 4 + index;
      points.push({ x, y, blink: seed % 3 === 0, order: seed % 7 });
    });
  });

  // Core pins on all four sides, as short stubs at board level.
  const pinStubs = [];
  pins.forEach((offset) => {
    [-1, 1].forEach((sign) => {
      pinStubs.push([[center.x + sign * (core / 2 - 4), center.y + offset], [center.x + sign * reach, center.y + offset]]);
      pinStubs.push([[center.x + offset, center.y + sign * (core / 2 - 4)], [center.x + offset, center.y + sign * reach]]);
    });
  });

  const percent = (value, total) => `${Number((value / total * 100).toFixed(3))}%`;
  const chips = [0, 1, 2, 3].map((index) => {
    const [x, y] = place([chip.dx, chip.dy], quadrant(index));
    return { x, y, left: percent(x, width), top: percent(y, height) };
  });

  return {
    width,
    height,
    center,
    mains,
    branches,
    aux: branches.map(toPath).join(' '),
    pins: pinStubs.map(toPath).join(' '),
    points,
    chips,
    chipSize: { width: percent(chip.width, width), height: percent(chip.height, height) },
    coreSize: percent(core, width),
  };
}

export const CIRCUITS = { wide: buildCircuit(LAYOUTS.wide), tall: buildCircuit(LAYOUTS.tall) };

// Delay before the pulse for a service reaches its chip. Everything is
// immediate when motion is reduced or paused.
export function arrivalDelay(index, all, instant) {
  if (instant) return 0;
  return TRAVEL_MS + (all ? CLOCKWISE_ORDER.indexOf(index) * STAGGER_MS : 0);
}

// Standby pulses run on the compositor: a dot moves along a trace with
// `translate3d` keyframes instead of repainting the SVG every frame. The
// runner element spans the whole board, so percentages map to board space.
// The dot travels during the first `travel` share of the cycle, then rests.
export function runnerFrames(points, width, height, travel = 0.42, depth = 3) {
  const lengths = points.slice(1).map(([x, y], index) => Math.hypot(x - points[index][0], y - points[index][1]));
  const total = lengths.reduce((sum, length) => sum + length, 0) || 1;
  const at = ([x, y]) => `translate3d(${Number((x / width * 100).toFixed(3))}%, ${Number((y / height * 100).toFixed(3))}%, ${depth}px)`;
  let distance = 0;
  const frames = points.map((point, index) => {
    if (index) distance += lengths[index - 1];
    const last = index === points.length - 1;
    return { offset: Number((travel * distance / total).toFixed(4)), transform: at(point), opacity: index === 0 || last ? 0 : 1 };
  });
  frames.push({ offset: 1, transform: at(points.at(-1)), opacity: 0 });
  return frames;
}

export const percentPoint = ({ x, y }, { width, height }) => ({ left: `${Number((x / width * 100).toFixed(3))}%`, top: `${Number((y / height * 100).toFixed(3))}%` });
