// Seeded pseudo-random number generator using Mulberry32
// Pure deterministic generation for reproducible Monte Carlo simulation

export function createMulberry32(seed: number) {
  let s = Math.floor(seed) >>> 0;
  return function next(): number {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Generate Poisson random variate using Knuth's algorithm (or Gaussian approximation for large lambda)
export function randomPoisson(rng: () => number, lambda: number): number {
  if (lambda <= 0) return 0;
  if (lambda < 30) {
    const L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    do {
      k++;
      p *= rng();
    } while (p > L);
    return k - 1;
  }
  // Gaussian approximation for large lambda: lambda + sqrt(lambda) * Z
  const u1 = Math.max(1e-10, rng());
  const u2 = rng();
  const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  const val = Math.round(lambda + Math.sqrt(lambda) * z);
  return Math.max(0, val);
}

// Gamma PDF evaluation for release curve
export function gammaPdf(x: number, shape: number, scale: number): number {
  if (x <= 0) return 0;
  // Approximation for Gamma distribution shape
  // y = (x^(k-1) * exp(-x/theta)) / (theta^k * Gamma(k))
  const z = x / scale;
  const num = Math.pow(z, shape - 1) * Math.exp(-z);
  // Stirlings or lookup for Gamma(shape) with shape ~ 2.5 - 3.5
  const gammaApprox = approxGamma(shape);
  return (num / (scale * gammaApprox));
}

function approxGamma(z: number): number {
  // Lanczos approximation (g=5, n=6)
  const p = [
    1.000000000190015,
    76.18009172947146,
    -86.50532032941677,
    24.01409824083091,
    -1.231739572450155,
    0.001208650973866179e-2,
    -0.5395239384953e-5
  ];
  let x = z - 1;
  let tmp = x + 5.5;
  tmp = (x + 0.5) * Math.log(tmp) - tmp;
  let ser = p[0];
  for (let i = 1; i < p.length; i++) {
    ser += p[i] / (x + i);
  }
  return Math.exp(tmp + Math.log(Math.sqrt(2 * Math.PI) * ser));
}
