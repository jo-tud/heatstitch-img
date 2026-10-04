import { describe, expect, it } from 'vitest';
import { digitize, digitizeDefaults, type DigitizeOptions } from '../src/digitize/digitize';
import { DEFAULT_PREPARE, Preparer, type PrepareOptions } from '../src/image/prepare';
import { COLOR_CHANGE, STITCH, TRIM, type Pattern } from '../src/model/pattern';
import { FILL, SATIN, stitchKinds } from '../src/model/sequence';
import { parsePattern } from '../src/parsers';
import { DEFAULT_PROFILE } from '../src/validation/profiles';
import { CRITICAL, validatePattern } from '../src/validation/validate';
import { writePattern } from '../src/writers';
import { BLACK, BLUE, RED, WHITE, shape, type Rgba } from './helpers/images';

const CLEAR: Rgba = [0, 0, 0, 0];

/** Image of `mm` x `mm` at 10 px per mm with a shape test in mm. */
function design(mm: number, test: (x: number, y: number) => Rgba | null, o: Partial<PrepareOptions> = {}, d: Partial<DigitizeOptions> = {}) {
  const px = mm * 10;
  const img = shape(px, px, (x, y) => test(x / 10, y / 10), WHITE);
  const prep = new Preparer(img).run({ ...DEFAULT_PREPARE, widthMm: mm, ...o });
  return { prep, ...digitize(prep, { ...digitizeDefaults(DEFAULT_PROFILE), ...d }, 'test') };
}

function kindShare(p: Pattern): Record<number, number> {
  const kinds = stitchKinds(p);
  const n: Record<number, number> = {};
  let total = 0;
  for (const k of kinds) {
    if (!k) continue;
    n[k] = (n[k] ?? 0) + 1;
    total++;
  }
  for (const k in n) n[k] /= total;
  return n;
}

/** STITCH records in mm (pattern coordinates are centered on the design). */
function stitches(p: Pattern, mm: number): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i < p.cmd.length; i++) if (p.cmd[i] === STITCH) out.push([p.x[i] / 10 + mm / 2, p.y[i] / 10 + mm / 2]);
  return out;
}

function roundTrips(p: Pattern): void {
  for (const format of ['pes', 'dst'] as const) {
    const back = parsePattern(writePattern(p, format), `x.${format}`);
    expect(back.cmd.filter((c) => c === STITCH).length).toBe(p.cmd.filter((c) => c === STITCH).length);
  }
}

const noCritical = (p: Pattern) => validatePattern(p, DEFAULT_PROFILE).zones.filter((z) => z.level === CRITICAL && !z.practice);

describe('digitize', () => {
  it('fills a large shape with tatami and underlay, inside its outline', () => {
    const { pattern, objects } = design(40, (x, y) => (x > 5 && x < 35 && y > 8 && y < 32 ? RED : null));
    expect(objects.map((o) => o.kind)).toEqual(['fill']);
    // The rest is underlay and travel (running stitch).
    expect(kindShare(pattern)[FILL]).toBeGreaterThan(0.5);
    for (const [x, y] of stitches(pattern, 40)) {
      expect(x).toBeGreaterThan(5 - 0.6);
      expect(x).toBeLessThan(35 + 0.6);
      expect(y).toBeGreaterThan(8 - 0.6);
      expect(y).toBeLessThan(32 + 0.6);
    }
    // 30 x 24 mm at 0.4 mm rows and 4 mm stitches: about 1 stitch per 1.6 mm² plus underlay.
    const n = stitches(pattern, 40).length;
    expect(n).toBeGreaterThan(400);
    expect(n).toBeLessThan(1000);
    expect(noCritical(pattern)).toEqual([]);
    roundTrips(pattern);
  });

  it('leaves holes free', () => {
    const { pattern } = design(40, (x, y) => {
      const outer = x > 5 && x < 35 && y > 5 && y < 35;
      // Transparent: a white hole would be sewn in white.
      if (Math.hypot(x - 20, y - 20) < 7) return CLEAR;
      return outer ? BLUE : null;
    });
    // Rows end at the hole's edge, lengthened by the pull compensation (0.2 mm).
    for (const [x, y] of stitches(pattern, 40)) expect(Math.hypot(x - 20, y - 20)).toBeGreaterThan(7 - 0.6);
  });

  it('sews a narrow ring as a satin column', () => {
    const { prep } = design(40, () => null);
    expect(prep.palette.length).toBe(0);
    const ring = (x: number, y: number) => {
      const d = Math.hypot(x - 20, y - 20);
      return d > 12 && d < 15 ? BLACK : null;
    };
    const { pattern, objects } = design(40, ring);
    // The white inside the ring is not connected to the background, so it is sewn (like eyes).
    expect(objects.map((o) => o.kind)).toEqual(['fill', 'satin']);
    expect(pattern.colors.map((c) => c.name)).toEqual(['White', 'Black']);
    // The satin covers the ring: penetrations sit on both edges (plus pull compensation).
    const black = pattern.cmd.indexOf(COLOR_CHANGE);
    const r = stitches({ ...pattern, cmd: pattern.cmd.map((c, i) => (i < black ? 0xff : c)) }, 40).map(([x, y]) => Math.hypot(x - 20, y - 20));
    expect(Math.min(...r)).toBeGreaterThan(11.4);
    expect(Math.max(...r)).toBeLessThan(15.6);
    expect(r.filter((d) => d > 14.5).length).toBeGreaterThan(100);
    expect(r.filter((d) => d < 12.5).length).toBeGreaterThan(100);
    expect(noCritical(pattern)).toEqual([]);
    roundTrips(pattern);
  });

  it('sews a branching stroke (a letter T) in one run without trims', () => {
    const { pattern, objects } = design(40, (x, y) => ((y > 8 && y < 12 && x > 6 && x < 34) || (x > 18 && x < 22 && y > 8 && y < 34) ? BLACK : null));
    expect(objects.map((o) => o.kind)).toEqual(['satin']);
    expect(pattern.cmd.filter((c) => c === TRIM).length).toBe(1); // only the final one
    expect(kindShare(pattern)[SATIN]).toBeGreaterThan(0.6);
    roundTrips(pattern);
  });

  it('sews thin lines as running stitch', () => {
    const { pattern, objects } = design(40, (x, y) => (Math.abs(y - 20) < 0.35 && x > 5 && x < 35 ? BLACK : null), { minAreaMm2: 1 });
    // Out and back along the line (the stitch kind detection reads the two passes as fill rows).
    expect(objects.map((o) => o.kind)).toEqual(['run']);
    const ys = stitches(pattern, 40).map((p) => p[1]);
    expect(Math.max(...ys.map((y) => Math.abs(y - 20)))).toBeLessThan(0.3);
    const xs = stitches(pattern, 40).map((p) => p[0]);
    expect(Math.min(...xs)).toBeLessThan(6);
    expect(Math.max(...xs)).toBeGreaterThan(34);
  });

  it('sews colors largest first, with color changes, trims and overlap', () => {
    // Red background square with a black satin ring and a blue disk on top.
    const { pattern, objects } = design(50, (x, y) => {
      const d = Math.hypot(x - 25, y - 25);
      if (d < 6) return BLUE;
      if (d > 14 && d < 17) return BLACK;
      return x > 4 && x < 46 && y > 4 && y < 46 ? RED : null;
    });
    expect(pattern.colors.length).toBe(3);
    expect(pattern.colors[0].r).toBeGreaterThan(150); // red first: the largest area
    expect(pattern.cmd.filter((c) => c === COLOR_CHANGE).length).toBe(2);
    expect(objects.filter((o) => o.kind === 'satin').length).toBe(1);
    expect(noCritical(pattern)).toEqual([]);
    roundTrips(pattern);
  });

  it('is deterministic', () => {
    const make = () => design(30, (x, y) => (Math.hypot(x - 15, y - 15) < 10 ? RED : null)).pattern;
    const a = make();
    const b = make();
    expect(Array.from(a.x)).toEqual(Array.from(b.x));
    expect(Array.from(a.cmd)).toEqual(Array.from(b.cmd));
  });
});
