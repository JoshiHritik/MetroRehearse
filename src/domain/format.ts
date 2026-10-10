// Operational formatting utilities

export function formatPax(num: number | undefined | null): string {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return Math.round(num).toLocaleString('en-IN');
}

export function formatDensity(density: number | undefined | null): string {
  if (density === undefined || density === null || isNaN(density)) return '0.0';
  return density.toFixed(2);
}

export function getDensityLevel(density: number): 'safe' | 'caution' | 'critical' {
  if (density < 3.0) return 'safe';
  if (density < 4.5) return 'caution';
  return 'critical';
}

export function getDensityColor(density: number): string {
  if (density < 3.0) return '#10B981'; // Green
  if (density < 4.5) return '#F59E0B'; // Amber
  return '#EF4444'; // Red
}

export function formatMinutes(mins: number | undefined | null): string {
  if (mins === undefined || mins === null || isNaN(mins)) return '0 min';
  const m = Math.round(mins);
  if (m < 60) return `${m} min`;
  const hrs = Math.floor(m / 60);
  const rem = m % 60;
  return rem > 0 ? `${hrs}h ${rem}m` : `${hrs}h`;
}

export function formatRiskPercent(risk: number): string {
  const pct = Math.round(risk * 100);
  return `${pct}%`;
}
