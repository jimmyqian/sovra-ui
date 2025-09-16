#!/usr/bin/env node

/**
 * Generate favicon.svg from the shared logo paths
 * This ensures the favicon is always in sync with the LogoIcon component
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Import the logo paths (we'll read the TypeScript file and extract the data)
const logoPathsFile = path.join(__dirname, '../src/assets/logo-paths.ts')
const logoPathsContent = fs.readFileSync(logoPathsFile, 'utf8')

// Extract the viewBox
const viewBoxMatch = logoPathsContent.match(/LOGO_VIEWBOX = "([^"]+)"/)
const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 51 52'

// Extract the paths array
const pathsMatch = logoPathsContent.match(
  /LOGO_PATHS = \[([\s\S]*?)\] as const/
)
if (!pathsMatch) {
  console.error('Could not extract logo paths from logo-paths.ts')
  process.exit(1)
}

// Parse the paths from the string
const pathsString = pathsMatch[1]
const paths = pathsString
  .split(/",\s*"/g) // Split on quote-comma-quote pattern
  .map(p => p.replace(/^["']|["']$/g, '').trim()) // Remove quotes and trim
  .filter(p => p.length > 0) // Remove empty entries
  .map(p => p.replace(/^"|"$/g, '')) // Remove any remaining quotes

console.log(`Found ${paths.length} logo paths`)

// Generate the SVG content
const brandOrange = '#ff6f16'
const svgContent = `<svg viewBox="${viewBox}" fill="none" xmlns="http://www.w3.org/2000/svg">
${paths.map(path => `  <path d="${path}" fill="${brandOrange}" />`).join('\n')}
</svg>`

// Write the favicon
const faviconPath = path.join(__dirname, '../public/favicon.svg')
fs.writeFileSync(faviconPath, svgContent)

console.log('✅ Generated favicon.svg from shared logo paths')
