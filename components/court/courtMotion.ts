export type Point = [number, number, number];
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const ease = (n: number) => { const t = clamp(n); return t * t * (3 - 2 * t); };
const blend = (a: Point, b: Point, t: number): Point => a.map((n, i) => mix(n, b[i], t)) as Point;

const views: { camera: Point; look: Point }[] = [
  { camera: [.62, .72, 1.65], look: [-.36, .29, 0] },
  { camera: [10, 12, 15], look: [-3.5, 0, -1] },
  { camera: [-11, 7, 10], look: [-2, .5, -4] },
  { camera: [2, 19, 8], look: [-4, 0, -2] },
  { camera: [8, 6, -3], look: [-1.5, 1, -10] },
  { camera: [4.4, 4.5, -6], look: [-.8, 2.5, -12] },
  { camera: [13, 17, 20], look: [0, 0, -2] },
];

/** Scroll is measured in chapter positions, independent of expanded content height. */
export function sampleCourtMotion(progress: number, mobile = false) {
  const p = Math.max(0, Math.min(6, progress));
  const chapter = Math.min(5, Math.floor(p));
  const fraction = p - chapter;
  // Hold each composition while its content is being read, then move to the next.
  const travel = ease((fraction - .18) / .82);
  const camera = blend(views[chapter].camera, views[chapter + 1].camera, travel);
  const look = blend(views[chapter].look, views[chapter + 1].look, travel);
  let ball: Point;
  let rotation: number;
  if (p <= 1) {
    const t = ease(p);
    ball = [0, .302, -4.6 * t]; rotation = -4.6 * t / .3;
  } else if (p <= 2) {
    const t = p - 1;
    ball = [3 * ease(t), .302 + 1.25 * Math.abs(Math.sin(t * Math.PI * 3)), -4.6 + 3.2 * ease(t)];
    rotation = -4.6 / .3 + t * 5;
  } else if (p <= 3) {
    const t = ease(p - 2), angle = t * Math.PI;
    ball = [3 * Math.cos(angle), .302, -1.4 - 3 * Math.sin(angle)];
    rotation = -4.6 / .3 + 5 - t * 10;
  } else if (p <= 4) {
    const t = p - 3;
    ball = [-3 + 3 * ease(t), .302 + 1.5 * Math.abs(Math.sin(t * Math.PI * 2)), -1.4 - 6.6 * ease(t)];
    rotation = -4.6 / .3 - 5 - t * 8;
  } else if (p <= 5) {
    const t = p - 4;
    // Parabolic shot arrives at the center of the far hoop on its descent.
    ball = [0, mix(.302, 3.12, t) + 3.8 * 4 * t * (1 - t), mix(-8, -12.09, t)];
    rotation = -4.6 / .3 - 13 - t * 4;
  } else {
    const t = p - 5;
    const y = t < .4 ? mix(3.12, .302, Math.pow(t / .4, 2)) : .302 + .65 * Math.abs(Math.sin((t - .4) / .6 * Math.PI * 2)) * (1 - t) / .6;
    ball = [0, y, -12.09 + 1.5 * ease((t - .4) / .6)];
    rotation = -4.6 / .3 - 17 - t * 3;
  }
  if (mobile) {
    const close = 1 - ease(p);
    camera[2] += .8 * close; look[0] += .32 * close; look[1] += .28 * close;
    const wide = ease(p);
    camera[0] *= 1 + .3 * wide; camera[1] *= 1 + .45 * wide; camera[2] *= 1 + .3 * wide;
  }
  return { camera, look, ball, rotation };
}
