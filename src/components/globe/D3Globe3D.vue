<template>
  <div ref="globeContainer" class="w-full h-full bg-bg-primary"></div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import * as d3 from 'd3'
  import * as topojson from 'topojson-client'
  import type { Topology, Objects } from 'topojson-specification'

  type TopologyData = Topology<Objects>

  interface WorldData {
    world: TopologyData | null
    countries: unknown | null
    land: unknown | null
    outline: { type: string }
    graticule: unknown
  }

  const globeContainer = ref<HTMLElement | null>(null)
  let svg: d3.Selection<SVGSVGElement, unknown, null, undefined> | null = null
  let projection: d3.GeoProjection | null = null
  let path: d3.GeoPath | null = null
  let resizeObserver: globalThis.ResizeObserver | null = null

  // Cache data to prevent re-fetching (component-level cache)
  let cachedWorldData: WorldData | null = null

  // Browser-level cache key for persistent storage
  const WORLD_DATA_CACHE_KEY = 'sovra-world-atlas-data'
  const CACHE_VERSION = '1.0'
  const CACHE_EXPIRY_DAYS = 7

  // Performance optimization: separate groups for different elements
  let baseGroup: d3.Selection<SVGGElement, unknown, null, undefined> | null =
    null

  // Throttling for drag events
  let dragAnimationFrame: number | null = null
  let lastUpdateTime = 0

  // Auto-rotation functionality
  let autoRotationFrame: number | null = null
  let isUserInteracting = false
  const autoRotationSpeed = 0.2 // degrees per frame

  /**
   * Check if cached data exists and is still valid
   */
  const getCachedWorldData = (): WorldData | null => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return null

      const cached = window.localStorage.getItem(WORLD_DATA_CACHE_KEY)
      if (!cached) return null

      const parsedCache = JSON.parse(cached)
      const cacheAge = Date.now() - parsedCache.timestamp
      const maxAge = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000

      if (parsedCache.version !== CACHE_VERSION || cacheAge > maxAge) {
        window.localStorage.removeItem(WORLD_DATA_CACHE_KEY)
        return null
      }

      return parsedCache.data
    } catch (error) {
      // TODO: Add proper error handling for cache failures
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(WORLD_DATA_CACHE_KEY)
      }
      return null
    }
  }

  /**
   * Save world data to browser cache
   */
  const setCachedWorldData = (data: WorldData): void => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return

      const cacheData = {
        version: CACHE_VERSION,
        timestamp: Date.now(),
        data
      }
      window.localStorage.setItem(
        WORLD_DATA_CACHE_KEY,
        JSON.stringify(cacheData)
      )
    } catch (error) {
      // TODO: Add proper error handling for cache storage failures
    }
  }

  /**
   * Loads world topology data with persistent browser caching
   */
  const loadWorldData = async (): Promise<WorldData> => {
    // Check component-level cache first
    if (cachedWorldData) {
      return cachedWorldData
    }

    // Check browser-level cache
    const browserCached = getCachedWorldData()
    if (browserCached) {
      cachedWorldData = browserCached
      return browserCached
    }
    try {
      // Use locally cached world atlas data (raw GitHub URL to avoid CORS)
      const world = await d3.json<TopologyData>(
        'https://raw.githubusercontent.com/imcnaney/donkey/main/assets/countries-110m.json'
      )

      if (!world || !world.objects.countries) {
        throw new Error('Failed to load world data')
      }

      const countries = topojson.feature(world, world.objects.countries)
      // Note: countries-110m.json doesn't have land objects, countries serve as both

      cachedWorldData = {
        world,
        countries,
        land: countries, // Use countries as land masses too
        outline: { type: 'Sphere' },
        graticule: d3.geoGraticule10()
      }

      // Cache in browser for future visits
      setCachedWorldData(cachedWorldData)

      return cachedWorldData
    } catch (error) {
      // Handle specific error cases
      if (error instanceof Error) {
        throw new Error(`Failed to load world atlas data: ${error.message}`)
      }
      throw new Error('Failed to load world atlas data: Unknown error')
    }
  }

  /**
   * Throttled update function for optimized drag performance
   * Only updates every frame instead of on every drag event
   */
  const throttledUpdate = () => {
    if (!projection || !path || !baseGroup) return

    const currentTime = Date.now()
    if (currentTime - lastUpdateTime > 16) {
      // ~60 FPS
      // Update all elements including borders and graticule
      baseGroup.selectAll('path').attr('d', path as unknown as string)
      lastUpdateTime = currentTime
    }
  }

  /**
   * Full rotation update for comprehensive element updates
   * Used when rotation changes significantly
   */
  const fullRotationUpdate = () => {
    if (!projection || !path || !baseGroup) return

    // Update all elements including borders and graticule
    baseGroup.selectAll('path').attr('d', path as unknown as string)
  }

  /**
   * Auto-rotation function that slowly rotates the globe from right to left
   */
  const autoRotate = () => {
    if (!projection || !path || !baseGroup || isUserInteracting) return
    if (typeof window === 'undefined') return

    // Get current rotation and increment longitude (rotate right to left visually)
    const currentRotation = projection.rotate()
    const newLongitude = currentRotation[0] + autoRotationSpeed

    // Update rotation
    projection.rotate([newLongitude, currentRotation[1], currentRotation[2]])

    // Update all paths
    baseGroup.selectAll('path').attr('d', path as unknown as string)

    // Continue auto-rotation
    autoRotationFrame = window.requestAnimationFrame(autoRotate)
  }

  /**
   * Start auto-rotation
   */
  const startAutoRotation = () => {
    if (typeof window === 'undefined') return

    if (autoRotationFrame) {
      window.cancelAnimationFrame(autoRotationFrame)
    }
    isUserInteracting = false
    autoRotationFrame = window.requestAnimationFrame(autoRotate)
  }

  /**
   * Stop auto-rotation
   */
  const stopAutoRotation = () => {
    if (autoRotationFrame && typeof window !== 'undefined') {
      window.cancelAnimationFrame(autoRotationFrame)
      autoRotationFrame = null
    }
  }

  /**
   * Initialize the 3D globe with optimized rendering
   */
  const initializeGlobe = async () => {
    if (!globeContainer.value) return

    try {
      const container = globeContainer.value
      const { clientWidth: width, clientHeight: height } = container

      // Clear any existing content
      d3.select(container).selectAll('*').remove()

      // Create SVG with proper sizing
      svg = d3
        .select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background-color', 'transparent')

      const worldData = await loadWorldData()

      // Configure orthographic projection for 3D globe effect
      projection = d3
        .geoOrthographic()
        .scale(Math.min(width, height) / 2.2)
        .translate([width / 2, height / 2])
        .rotate([0, -10, 0]) // Start with slight tilt
        .clipAngle(90) // Only show front hemisphere

      path = d3.geoPath().projection(projection)

      // Create performance-optimized groups
      baseGroup = svg.append('g').attr('class', 'base-geography')

      // Add world elements in render order
      // 1. Ocean/sphere background
      baseGroup
        .append('path')
        .datum(worldData.outline)
        .attr('class', 'sphere')
        .attr('d', path as unknown as string)
        .attr('fill', 'var(--color-globe-ocean)')
        .attr('stroke', 'none')

      // 2. Graticule (grid lines)
      baseGroup
        .append('path')
        .datum(worldData.graticule)
        .attr('class', 'graticule')
        .attr('d', path as unknown as string)
        .attr('fill', 'none')
        .attr('stroke', 'var(--color-globe-grid)')
        .attr('stroke-width', 0.5)
        .attr('opacity', 0.3)

      // 3. Land masses (countries)
      if (worldData.countries) {
        baseGroup
          .append('path')
          .datum(worldData.countries)
          .attr('class', 'countries')
          .attr('d', path as unknown as string)
          .attr('fill', 'var(--color-globe-land)')
          .attr('stroke', 'var(--color-globe-land-border)')
          .attr('stroke-width', 0.3)
          .attr('opacity', 0.9)
      }

      // Add drag behavior for smooth globe rotation
      const drag = d3
        .drag<SVGSVGElement, unknown>()
        .on('start', function () {
          // Stop auto-rotation when user starts interacting
          isUserInteracting = true
          stopAutoRotation()

          // Cancel any existing animation frames
          if (dragAnimationFrame) {
            window.cancelAnimationFrame(dragAnimationFrame)
          }
        })
        .on('drag', function (event) {
          if (!projection) return

          // Get current rotation and apply drag delta
          const currentRotation = projection.rotate()
          const sensitivity = 0.25

          // Update rotation based on drag movement
          projection.rotate([
            currentRotation[0] + event.dx * sensitivity,
            Math.max(
              -90,
              Math.min(90, currentRotation[1] - event.dy * sensitivity)
            ),
            currentRotation[2]
          ])

          // Throttled update for smooth performance
          if (dragAnimationFrame) {
            window.cancelAnimationFrame(dragAnimationFrame)
          }
          dragAnimationFrame = window.requestAnimationFrame(throttledUpdate)
        })
        .on('end', function () {
          // Final update when drag ends
          fullRotationUpdate()

          // Resume auto-rotation after a longer delay
          setTimeout(() => {
            startAutoRotation()
          }, 10000) // 10 second delay before resuming auto-rotation
        })

      svg.call(drag)

      // Start auto-rotation
      startAutoRotation()
    } catch (error) {
      // TODO: Add proper error handling for globe initialization failures

      // Show error message in the container
      if (globeContainer.value) {
        const container = globeContainer.value
        d3.select(container).selectAll('*').remove()

        d3.select(container)
          .append('div')
          .style('color', 'red')
          .style('padding', '20px')
          .style('font-family', 'monospace')
          .text(`Globe initialization failed: ${error}`)
      }
    }
  }

  /**
   * Handle container resize with debouncing
   */
  const handleResize = () => {
    if (!globeContainer.value || !svg || !projection) return

    const { clientWidth: width, clientHeight: height } = globeContainer.value

    // Update SVG dimensions
    svg.attr('width', width).attr('height', height)

    // Update projection scale and translation
    projection
      .scale(Math.min(width, height) / 2.2)
      .translate([width / 2, height / 2])

    // Update all paths
    fullRotationUpdate()
  }

  // Component lifecycle
  onMounted(() => {
    initializeGlobe()

    // Setup resize observer for responsive behavior
    if (globeContainer.value && typeof window !== 'undefined') {
      resizeObserver = new window.ResizeObserver(handleResize)
      resizeObserver.observe(globeContainer.value)
    }
  })

  onUnmounted(() => {
    // Cleanup
    if (resizeObserver) {
      resizeObserver.disconnect()
    }
    if (dragAnimationFrame && typeof window !== 'undefined') {
      window.cancelAnimationFrame(dragAnimationFrame)
    }
    // Stop auto-rotation
    stopAutoRotation()

    // Keep cachedWorldData in memory for faster subsequent loads
    // Browser cache also persists across sessions
  })
</script>

<script lang="ts">
  export default {
    name: 'D3Globe3D'
  }
</script>
