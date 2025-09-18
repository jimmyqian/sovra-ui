/**
 * Sovra Logo SVG Path Definitions
 * Single source of truth for the logo paths used across the application
 */

export const LOGO_VIEWBOX = '0 0 51 52'

export const LOGO_PATHS = [
  // Outer thin ring with 25 degree gap at top
  'M29.3 10.8A17.5 17.5 0 1 1 21.7 10.8L23.4 12.4A15 15 0 1 0 27.6 12.4Z',

  // Inner thin ring with 25 degree gap at top
  'M27.1 19.6A7.5 7.5 0 1 1 23.9 19.6L24.8 20.4A5.5 5.5 0 1 0 26.2 20.4Z',

  // Asterisk symbol in center (filled paths)
  'M25 20L26 20L26 25L31 25L31 26L26 26L26 31L25 31L25 26L20 26L20 25L25 25ZM22.8 22.8L23.5 22.1L28.2 26.8L27.5 27.5ZM27.5 22.1L28.2 22.8L23.5 27.5L22.8 26.8Z'
] as const

/**
 * Create a gapped version of a logo path by truncating it
 * @param path - Original SVG path string
 * @param gapDegrees - Size of gap in degrees (0-360)
 * @returns Modified path string with gap
 */
function createGappedPath(path: string, gapDegrees: number): string {
  if (gapDegrees <= 0) return path

  // Simple approach: truncate path by removing a percentage of the end
  // This creates a gap by shortening the path
  const gapPercentage = Math.min(gapDegrees / 360, 0.3) // Max 30% gap
  const truncateLength = Math.floor(path.length * gapPercentage)

  // Find a good truncation point (prefer after a space or comma)
  let truncateIndex = path.length - truncateLength
  for (let i = truncateIndex; i < path.length && i < truncateIndex + 50; i++) {
    if (path[i] === ' ' || path[i] === ',') {
      truncateIndex = i
      break
    }
  }

  return path.substring(0, truncateIndex)
}

/**
 * Generate SVG string with the given fill color and optional gaps
 * @param fillColor - Fill color for the logo paths
 * @param gapDegrees - Size of gaps in degrees (0 = no gaps, 5 = small gaps)
 */
export function generateLogoSVG(fillColor = '#ff6f16', gapDegrees = 0): string {
  const paths =
    gapDegrees > 0
      ? LOGO_PATHS.map(path => createGappedPath(path, gapDegrees))
      : LOGO_PATHS

  return `<svg viewBox="${LOGO_VIEWBOX}" fill="none" xmlns="http://www.w3.org/2000/svg">
${paths.map(path => `  <path d="${path}" fill="${fillColor}" />`).join('\n')}
</svg>`
}
