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

// Easter egg logo paths - Star Wars Rebel Alliance logo
export const EASTER_EGG_LOGO_PATHS = [
  // Rebel Alliance logo - scaled to fit viewBox 0 0 51 52, centered at 25.5, 26
  'M25.5 1L21.9 4.7C23.5 6.7 24.1 9.0 24.1 10.2C22.8 8.4 21.3 7.8 19.7 6.9L17.3 9.9C20.9 11.1 22.8 14.8 22.8 18.8C22.8 20.6 22.2 25.4 17.3 25.3L17.3 25.2C14.5 24.8 11.6 20.6 11.3 16.2C11.0 11.9 12.6 7.5 15.3 3.8L15.2 3.8C10.7 7.3 7.6 13.2 7.1 20.3C7.1 20.7 7.0 21.0 7.0 21.4C7.0 21.4 7.0 21.5 7.0 21.5C7.0 21.9 6.9 22.3 6.9 22.7C6.9 23.1 6.9 23.5 6.9 23.9C6.9 33.4 15.0 41.0 25.5 41.0C36.0 41.0 44.1 33.4 44.1 23.9C44.1 23.2 44.0 22.6 43.9 21.9C43.4 14.8 40.3 8.9 35.8 5.4L35.7 5.4C38.4 9.1 40.0 13.5 39.7 17.8C39.4 22.2 36.5 26.4 33.7 26.8L33.7 26.9C29.8 27.2 29.1 22.2 29.1 20.4C29.1 16.4 31.0 12.7 33.7 11.5L31.3 8.5C29.7 9.4 28.2 10.0 26.9 11.8C26.9 10.6 27.5 8.3 29.1 6.3L25.5 1Z'
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
 * @param useEasterEgg - Whether to use the easter egg logo design
 */
export function generateLogoSVG(
  fillColor = '#ff6f16',
  gapDegrees = 0,
  useEasterEgg = false
): string {
  const logoPaths = useEasterEgg ? EASTER_EGG_LOGO_PATHS : LOGO_PATHS
  const paths =
    gapDegrees > 0 && !useEasterEgg
      ? logoPaths.map(path => createGappedPath(path, gapDegrees))
      : logoPaths

  return `<svg viewBox="${LOGO_VIEWBOX}" fill="none" xmlns="http://www.w3.org/2000/svg">
${paths.map(path => `  <path d="${path}" fill="${fillColor}" />`).join('\n')}
</svg>`
}
