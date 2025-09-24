<template>
  <div ref="globeContainer" class="w-full h-full bg-bg-primary"></div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import * as d3 from 'd3'
  import * as topojson from 'topojson-client'

  interface SpikeData {
    id: string
    latitude: number
    longitude: number
    height: number
    coordinates: [number, number]
  }

  interface WorldData {
    world: unknown | null
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

  // Cache data to prevent re-fetching
  let cachedWorldData: WorldData | null = null
  let cachedSpikeData: SpikeData[] | null = null

  // Performance optimization: separate groups for different elements
  let baseGroup: d3.Selection<SVGGElement, unknown, null, undefined> | null =
    null
  let spikesGroup: d3.Selection<SVGGElement, unknown, null, undefined> | null =
    null

  // Throttling for drag events
  let dragAnimationFrame: number | null = null
  let lastUpdateTime = 0
  let frameCounter = 0

  /**
   * 3D spike calculation utilities for realistic globe protrusion
   */
  const spike3D = {
    /**
     * Calculate the 3D depth/distance from viewer for a point on the globe
     */
    calculateDepth: (longitude: number, latitude: number, rotation: [number, number, number]): number => {
      const [rotLong, rotLat] = rotation

      // Convert to radians
      const lon = (longitude * Math.PI) / 180
      const lat = (latitude * Math.PI) / 180
      const rLon = (rotLong * Math.PI) / 180
      const rLat = (rotLat * Math.PI) / 180

      // Calculate 3D position on unit sphere
      const x = Math.cos(lat) * Math.cos(lon)
      const y = Math.cos(lat) * Math.sin(lon)
      const z = Math.sin(lat)

      // Apply rotation to find depth relative to viewer
      // Positive z is toward viewer, negative z is away
      const rotatedZ = x * Math.sin(rLon) * Math.cos(rLat) +
                      y * Math.cos(rLon) * Math.cos(rLat) +
                      z * Math.sin(rLat)

      return rotatedZ
    },

    /**
     * Calculate perspective scale factor based on depth
     */
    getPerspectiveScale: (depth: number): number => {
      // Scale from 0.3 to 1.2 based on depth (-1 to 1)
      // Points closer to viewer appear larger
      return 0.3 + (depth + 1) * 0.45
    },

    /**
     * Calculate opacity based on depth (back face culling effect)
     */
    getDepthOpacity: (depth: number): number => {
      // Points on back hemisphere are more transparent
      return Math.max(0.2, 0.5 + depth * 0.5)
    },

    /**
     * Calculate the normal vector direction for spike orientation
     */
    getNormalVector: (longitude: number, latitude: number): [number, number, number] => {
      const lon = (longitude * Math.PI) / 180
      const lat = (latitude * Math.PI) / 180

      return [
        Math.cos(lat) * Math.cos(lon),
        Math.cos(lat) * Math.sin(lon),
        Math.sin(lat)
      ]
    },

    /**
     * Project 3D normal to 2D screen space for spike direction
     */
    projectNormal: (normal: [number, number, number], projection: d3.GeoProjection): [number, number] => {
      // Use projection to convert the tip of the normal vector
      const tipCoords = projection([
        Math.atan2(normal[1], normal[0]) * 180 / Math.PI,
        Math.asin(normal[2]) * 180 / Math.PI
      ])

      // Calculate direction vector in screen space
      return tipCoords ? [tipCoords[0], tipCoords[1]] : [0, 0]
    }
  }


  /**
   * Generates 12 spikes with varying heights placed at major world cities
   * Uses caching to prevent regeneration on every render
   */
  const generateSpikeData = (): SpikeData[] => {
    if (cachedSpikeData) {
      return cachedSpikeData
    }

    const locations = [
      { name: 'New York', coordinates: [-74.0, 40.7] as [number, number] },
      { name: 'London', coordinates: [0.1, 51.5] as [number, number] },
      { name: 'Tokyo', coordinates: [139.7, 35.7] as [number, number] },
      { name: 'Sydney', coordinates: [151.2, -33.9] as [number, number] },
      { name: 'São Paulo', coordinates: [-46.6, -23.5] as [number, number] },
      { name: 'Cairo', coordinates: [31.2, 30.0] as [number, number] },
      { name: 'Mumbai', coordinates: [72.8, 19.1] as [number, number] },
      { name: 'Beijing', coordinates: [116.4, 39.9] as [number, number] },
      { name: 'Los Angeles', coordinates: [-118.2, 34.1] as [number, number] },
      { name: 'Lagos', coordinates: [3.4, 6.5] as [number, number] },
      { name: 'Moscow', coordinates: [37.6, 55.8] as [number, number] },
      { name: 'Buenos Aires', coordinates: [-58.4, -34.6] as [number, number] }
    ]

    cachedSpikeData = locations.map((location, i) => ({
      id: `spike-${i}`,
      latitude: location.coordinates[1],
      longitude: location.coordinates[0],
      height: Math.random() * 40 + 10, // 10 to 50 pixel height
      coordinates: location.coordinates
    }))

    return cachedSpikeData
  }

  /**
   * Loads real world topology data and creates graticule
   * Uses caching to prevent re-fetching on every render
   */
  const loadWorldTopology = async (): Promise<WorldData> => {
    if (cachedWorldData) {
      return cachedWorldData
    }

    try {
      const world = await d3.json(
        'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
      )
      const graticule = d3.geoGraticule()

      cachedWorldData = {
        world,
        countries: world
          ? (topojson as any).feature(world, (world as any).objects.countries)
          : null,
        land: world
          ? (topojson as any).feature(world, (world as any).objects.land)
          : null,
        outline: { type: 'Sphere' },
        graticule: graticule()
      }

      return cachedWorldData
    } catch (error) {
      const graticule = d3.geoGraticule()
      cachedWorldData = {
        world: null,
        countries: null,
        land: null,
        outline: { type: 'Sphere' },
        graticule: graticule()
      }
      return cachedWorldData
    }
  }

  /**
   * Ultra-lightweight rotation update - minimum DOM manipulation
   */
  const updateRotation = () => {
    if (!projection || !path || !baseGroup) return

    try {
      // Only update the most essential elements to prevent flashing
      // Update sphere and land only (skip borders and graticule during drag)
      const sphere = baseGroup.select('.sphere')
      const land = baseGroup.select('.land')

      if (!sphere.empty()) {
        sphere.attr('d', path as unknown as string)
      }
      if (!land.empty()) {
        land.attr('d', path as unknown as string)
      }

      // Skip country borders and graticule during active drag to reduce flashing
      // These will be updated in dragended

      // Only update visible spikes (performance optimization)
      if (spikesGroup && cachedSpikeData) {
        spikesGroup.selectAll('.spike').each(function(_, i) {
          const spike = cachedSpikeData![i]
          if (!spike || !projection) return

          const coords = projection([spike.longitude, spike.latitude])
          if (!coords) {
            // Coordinates are behind the horizon - hide the spike
            d3.select(this as SVGGElement).style('display', 'none')
            return
          }

          // Calculate 3D properties for real-time updates
          const currentRotation = projection.rotate() as [number, number, number]
          const depth = spike3D.calculateDepth(spike.longitude, spike.latitude, currentRotation)
          const scale = spike3D.getPerspectiveScale(depth)
          const opacity = spike3D.getDepthOpacity(depth)
          const normal = spike3D.getNormalVector(spike.longitude, spike.latitude)

          const element = d3.select(this as SVGGElement)

          // Pin is visible since D3 could project its coordinates
          element.style('display', 'block')

          const [x, y] = coords

          // Simple radial projection from globe center
          // This works because orthographic projection shows the globe as a circle
          const baseHeight = spike.height * scale

          // Find the center of the globe in screen coordinates
          const globeCenter = projection([0, 0])
          if (!globeCenter) return

          const [centerX, centerY] = globeCenter

          // Calculate direction from center to spike base
          const dirX = x - centerX
          const dirY = y - centerY
          const distance = Math.sqrt(dirX * dirX + dirY * dirY)

          if (distance === 0) return

          // Normalize direction and apply perspective based on depth
          const perspectiveScale = Math.max(0.3, 1.0 + depth * 0.5)
          const effectiveHeight = baseHeight * perspectiveScale

          const normX = dirX / distance
          const normY = dirY / distance

          const tipX = x + normX * effectiveHeight
          const tipY = y + normY * effectiveHeight

          // Update spike elements with 3D properties
          element.select('line')
            .attr('x1', x).attr('y1', y)
            .attr('x2', tipX).attr('y2', tipY)
            .attr('stroke-width', Math.max(1, 2 * scale))
            .attr('opacity', opacity)

          element.select('.spike-base')
            .attr('cx', x).attr('cy', y)
            .attr('r', 2 * scale)
            .attr('fill', depth < 0 ? 'var(--color-brand-orange)' : 'var(--brand-color-dark)')
            .attr('opacity', opacity * 0.9)

          element.select('.spike-top')
            .attr('cx', tipX).attr('cy', tipY)
            .attr('r', Math.max(1, 3 * scale))
            .attr('fill', depth < 0 ? '#ffaa66' : 'var(--brand-color-dark)')
            .attr('stroke-width', scale * 0.5)
            .attr('opacity', opacity)

          // Update glow effect if it exists
          const glow = element.select('.spike-glow')
          if (!glow.empty()) {
            if (depth < -0.2) {
              glow.attr('cx', tipX).attr('cy', tipY)
                  .attr('r', Math.max(1, 3 * scale) * 1.5)
                  .attr('opacity', Math.min(0.3, scale * 0.2))
                  .style('display', 'block')
            } else {
              glow.style('display', 'none')
            }
          }
        })
      }
    } catch (error) {
      // Silently handle any rendering errors to prevent crashes during drag
    }
  }

  /**
   * Complete update including all elements - used when drag ends
   */
  const fullRotationUpdate = () => {
    if (!projection || !path || !baseGroup) return

    // Update all elements including borders and graticule
    baseGroup.selectAll('path').attr('d', path as unknown as string)

    // Update all spikes with full 3D calculations
    if (spikesGroup && cachedSpikeData) {
      spikesGroup.selectAll('.spike').each(function(_, i) {
        const spike = cachedSpikeData![i]
        if (!spike || !projection) return

        const coords = projection([spike.longitude, spike.latitude])
        if (!coords) {
          // Coordinates are behind the horizon - hide the spike
          d3.select(this as SVGGElement).style('display', 'none')
          return
        }

        const currentRotation = projection.rotate() as [number, number, number]
        const depth = spike3D.calculateDepth(spike.longitude, spike.latitude, currentRotation)
        const scale = spike3D.getPerspectiveScale(depth)
        const opacity = spike3D.getDepthOpacity(depth)
        const normal = spike3D.getNormalVector(spike.longitude, spike.latitude)

        const element = d3.select(this as SVGGElement)

        // Simple visibility check based on depth
        if (depth < 0) {
          element.style('display', 'none')
          return
        } else {
          element.style('display', 'block')
        }

        const [x, y] = coords
        const scaledHeight = spike.height * scale

        // Simple radial projection from globe center
        const baseHeight = spike.height * scale

        // Find the center of the globe in screen coordinates
        const globeCenter = projection([0, 0])
        if (!globeCenter) return

        const [centerX, centerY] = globeCenter

        // Calculate direction from center to spike base
        const dirX = x - centerX
        const dirY = y - centerY
        const distance = Math.sqrt(dirX * dirX + dirY * dirY)

        if (distance === 0) return

        // Normalize direction and apply perspective based on depth
        const perspectiveScale = Math.max(0.3, 1.0 + depth * 0.5)
        const effectiveHeight = baseHeight * perspectiveScale

        const normX = dirX / distance
        const normY = dirY / distance

        const tipX = x + normX * effectiveHeight
        const tipY = y + normY * effectiveHeight

        // Update all spike elements with full 3D properties
        element.select('line')
          .attr('x1', x).attr('y1', y)
          .attr('x2', tipX).attr('y2', tipY)
          .attr('stroke-width', Math.max(1, 2 * scale))
          .attr('opacity', opacity)

        element.select('.spike-base')
          .attr('cx', x).attr('cy', y)
          .attr('r', 2 * scale)
          .attr('fill', depth < 0 ? 'var(--color-brand-orange)' : 'var(--brand-color-dark)')
          .attr('opacity', opacity * 0.9)

        element.select('.spike-top')
          .attr('cx', tipX).attr('cy', tipY)
          .attr('r', Math.max(1, 3 * scale))
          .attr('fill', depth < 0 ? '#ffaa66' : 'var(--brand-color-dark)')
          .attr('stroke-width', scale * 0.5)
          .attr('opacity', opacity)

        // Update glow effects
        const glow = element.select('.spike-glow')
        if (!glow.empty()) {
          if (depth > 0.2) {
            glow.attr('cx', tipX).attr('cy', tipY)
                .attr('r', Math.max(1, 3 * scale) * 1.5)
                .attr('opacity', Math.min(0.3, scale * 0.2))
                .style('display', 'block')
          } else {
            glow.style('display', 'none')
          }
        }
      })
    }
  }

  /**
   * Creates robust drag behavior with simplified rotation calculations
   * Avoids gimbal lock and pole singularities
   */
  const createDragBehavior = () => {
    if (!projection) return null

    let startX = 0, startY = 0
    let startRotation: [number, number, number] = [0, 0, 0]

    const dragstarted = (
      event: d3.D3DragEvent<SVGSVGElement, unknown, unknown>
    ) => {
      startX = event.x
      startY = event.y
      if (projection) {
        startRotation = projection.rotate() as [number, number, number]
      }
    }

    const dragged = (
      event: d3.D3DragEvent<SVGSVGElement, unknown, unknown>
    ) => {
      if (!projection) return

      // Calculate mouse movement
      const dx = event.x - startX
      const dy = event.y - startY

      // Convert mouse movement to rotation angles
      // Scale factor to make rotation feel natural
      const scale = 0.5

      // Calculate new rotation based on mouse movement
      const rotationX = startRotation[1] - dy * scale  // Latitude (pitch) - inverted for intuitive controls
      const rotationY = startRotation[0] + dx * scale  // Longitude (yaw) - inverted for intuitive controls

      // Constrain latitude to avoid pole lock
      const constrainedRotationX = Math.max(-85, Math.min(85, rotationX))

      // Update projection with new rotation
      projection.rotate([rotationY, constrainedRotationX, startRotation[2]])

      // Throttle expensive DOM updates to reduce flashing
      const now = performance.now()
      frameCounter++

      // Cancel any pending frame
      if (dragAnimationFrame) {
        globalThis.cancelAnimationFrame(dragAnimationFrame)
      }

      // Update DOM every frame for smooth pin visibility transitions
      dragAnimationFrame = globalThis.requestAnimationFrame(() => {
        updateRotation()
        lastUpdateTime = now
      })
    }

    const dragended = () => {
      // Clean up and do final update
      if (dragAnimationFrame) {
        globalThis.cancelAnimationFrame(dragAnimationFrame)
        dragAnimationFrame = null
      }

      // Reset counters and do final complete update to ensure consistency
      frameCounter = 0
      lastUpdateTime = 0
      fullRotationUpdate() // Complete update including all elements
    }

    return d3
      .drag<SVGSVGElement, unknown>()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended)
  }

  /**
   * Initial render - creates all DOM elements once
   * This replaces the old render function that was clearing everything
   */
  const initialRender = async () => {
    if (!svg || !projection || !path) return

    // Clear any existing content
    svg.selectAll('*').remove()

    const spikeData = generateSpikeData()
    const worldData = await loadWorldTopology()

    // Create base group for geography (gets updated on rotation)
    baseGroup = svg.append('g').attr('class', 'base-geography')

    // Draw globe outline (ocean) - this rotates with the globe
    baseGroup
      .append('path')
      .datum(worldData.outline)
      .attr('class', 'sphere')
      .attr('d', path as unknown as string)
      .attr('fill', '#1e3a8a') // Deep blue ocean
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 2)

    // Draw land/countries if available
    if (worldData.land) {
      baseGroup
        .selectAll('.land')
        .data([worldData.land])
        .enter()
        .append('path')
        .attr('class', 'land')
        .attr('d', path as unknown as string)
        .attr('fill', '#4B5563') // Dark gray land
        .attr('stroke', 'none')
    }

    // Draw country borders if available
    if (worldData.countries) {
      baseGroup
        .selectAll('.country')
        .data((worldData.countries as { features: unknown[] }).features)
        .enter()
        .append('path')
        .attr('class', 'country')
        .attr('d', path as unknown as string)
        .attr('fill', 'none')
        .attr('stroke', '#6B7280') // Light gray borders
        .attr('stroke-width', 0.5)
        .attr('opacity', 0.7)
    }

    // Draw graticule (grid lines) - more subtle
    baseGroup
      .append('path')
      .datum(worldData.graticule)
      .attr('class', 'graticule')
      .attr('d', path as unknown as string)
      .attr('fill', 'none')
      .attr('stroke', '#60a5fa')
      .attr('stroke-width', 0.25)
      .attr('opacity', 0.2)

    // Create spikes group (separate from base geography)
    spikesGroup = svg.append('g').attr('class', 'spikes')

    // Create 3D spike elements with perspective and depth
    if (spikesGroup && projection) {
      spikeData.forEach(spike => {
        if (!projection) return
        const coords = projection([spike.longitude, spike.latitude])
        if (!coords) return

        const [x, y] = coords
        const currentRotation = projection.rotate() as [number, number, number]

        // Calculate 3D properties
        const depth = spike3D.calculateDepth(spike.longitude, spike.latitude, currentRotation)
        const scale = spike3D.getPerspectiveScale(depth)
        const opacity = spike3D.getDepthOpacity(depth)
        const normal = spike3D.getNormalVector(spike.longitude, spike.latitude)

        // Skip spikes that are on the back side (negative depth)
        // No depth filtering - if D3 projected the coordinates, they're visible

        const spikeGroup = spikesGroup!.append('g').attr('class', 'spike')

        // Calculate spike dimensions with 3D scaling
        const scaledHeight = spike.height * scale
        const baseRadius = 2 * scale
        const topRadius = Math.max(1, 3 * scale)
        const strokeWidth = Math.max(1, 2 * scale)

        // Simple radial projection from globe center
        const baseHeight = spike.height * scale

        // Find the center of the globe in screen coordinates
        const globeCenter = projection([0, 0])
        if (!globeCenter) return

        const [centerX, centerY] = globeCenter

        // Calculate direction from center to spike base
        const dirX = x - centerX
        const dirY = y - centerY
        const distance = Math.sqrt(dirX * dirX + dirY * dirY)

        if (distance === 0) return

        // Normalize direction and apply perspective based on depth
        const perspectiveScale = Math.max(0.3, 1.0 + depth * 0.5)
        const effectiveHeight = baseHeight * perspectiveScale

        const normX = dirX / distance
        const normY = dirY / distance

        const tipX = x + normX * effectiveHeight
        const tipY = y + normY * effectiveHeight

        // Create gradient definition for 3D appearance
        const gradientId = `spike-gradient-${spike.id}`
        if (!svg) return
        const defs = svg.select('defs').empty() ? svg.append('defs') : svg.select('defs')

        const gradient = defs.append('linearGradient')
          .attr('id', gradientId)
          .attr('gradientUnits', 'objectBoundingBox')
          .attr('x1', '0%').attr('y1', '0%')
          .attr('x2', '100%').attr('y2', '100%')

        gradient.append('stop')
          .attr('offset', '0%')
          .attr('stop-color', depth > 0 ? '#ff8c42' : '#cc6633')  // Brighter when facing viewer
          .attr('stop-opacity', opacity)

        gradient.append('stop')
          .attr('offset', '100%')
          .attr('stop-color', depth > 0 ? '#e67829' : '#994d1a')  // Darker at tip
          .attr('stop-opacity', opacity * 0.8)

        // Draw 3D spike body as a tapered line with variable width
        spikeGroup
          .append('line')
          .attr('x1', x)
          .attr('y1', y)
          .attr('x2', tipX)
          .attr('y2', tipY)
          .attr('stroke', `url(#${gradientId})`)
          .attr('stroke-width', strokeWidth)
          .attr('stroke-linecap', 'round')
          .attr('opacity', opacity)

        // Draw spike base with depth-appropriate size
        spikeGroup
          .append('circle')
          .attr('class', 'spike-base')
          .attr('cx', x)
          .attr('cy', y)
          .attr('r', baseRadius)
          .attr('fill', depth < 0 ? 'var(--color-brand-orange)' : 'var(--brand-color-dark)')
          .attr('opacity', opacity * 0.9)

        // Draw spike tip with enhanced 3D appearance
        spikeGroup
          .append('circle')
          .attr('class', 'spike-top')
          .attr('cx', tipX)
          .attr('cy', tipY)
          .attr('r', topRadius)
          .attr('fill', depth < 0 ? '#ffaa66' : 'var(--brand-color-dark)')  // Highlight tip
          .attr('stroke', depth > 0 ? '#ffffff' : '#888888')
          .attr('stroke-width', scale * 0.5)
          .attr('opacity', opacity)

        // Add a subtle shadow/glow effect for depth
        if (depth < -0.2) {  // Only for forward-facing spikes
          spikeGroup
            .append('circle')
            .attr('class', 'spike-glow')
            .attr('cx', tipX)
            .attr('cy', tipY)
            .attr('r', topRadius * 1.5)
            .attr('fill', '#ffaa66')
            .attr('opacity', Math.min(0.3, scale * 0.2))
            .style('filter', 'blur(2px)')
        }
      })
    }

    // Add static UI elements that don't rotate
    const uiGroup = svg.append('g').attr('class', 'ui-elements')

    // Add title
    uiGroup
      .append('text')
      .attr('x', (svg.node() as SVGSVGElement).clientWidth / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .style('fill', 'rgb(229 231 235)')
      .style('font-size', '18px')
      .style('font-weight', '600')
      .text('Interactive 3D Globe')

    // Add drag instructions
    uiGroup
      .append('text')
      .attr('x', (svg.node() as SVGSVGElement).clientWidth / 2)
      .attr('y', (svg.node() as SVGSVGElement).clientHeight - 20)
      .attr('text-anchor', 'middle')
      .style('fill', 'rgb(156 163 175)')
      .style('font-size', '14px')
      .text('Drag to rotate globe')
  }

  /**
   * Creates and initializes the 3D globe visualization with optimized rendering
   */
  const createGlobe3D = (): void => {
    if (!globeContainer.value) return

    // Clear any existing content
    d3.select(globeContainer.value).selectAll('*').remove()

    const container = globeContainer.value
    const width = container.clientWidth
    const height = container.clientHeight

    if (width <= 0 || height <= 0) return

    // Create orthographic projection for 3D effect
    projection = d3
      .geoOrthographic()
      .scale(Math.min(width, height) / 3)
      .translate([width / 2, height / 2])
      .clipAngle(90)

    path = d3.geoPath().projection(projection)

    // Create SVG with improved performance settings
    svg = d3
      .select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('shape-rendering', 'geometricPrecision') // Better rendering quality
      .style('cursor', 'grab') // Visual feedback

    if (!svg) return

    // Add drag behavior with optimized performance
    const drag = createDragBehavior()
    if (drag) {
      svg.call(drag)

      // Update cursor during drag
      svg.on('mousedown', function () {
        d3.select(this).style('cursor', 'grabbing')
      })

      svg.on('mouseup', function () {
        d3.select(this).style('cursor', 'grab')
      })
    }

    // Use optimized initial render
    initialRender().catch(error => {
      // TODO: Add proper error handling for globe rendering
      throw error
    })
  }

  /**
   * Handles window resize to redraw globe
   */
  const handleResize = (): void => {
    createGlobe3D()
  }

  onMounted(() => {
    createGlobe3D()

    // Set up resize observer
    if (globeContainer.value) {
      resizeObserver = new globalThis.ResizeObserver(handleResize)
      resizeObserver.observe(globeContainer.value)
    }
  })

  onUnmounted(() => {
    // Clean up resize observer
    if (resizeObserver) {
      resizeObserver.disconnect()
    }

    // Cancel any pending animation frames
    if (dragAnimationFrame) {
      globalThis.cancelAnimationFrame(dragAnimationFrame)
    }

    // Clear caches to free memory
    cachedWorldData = null
    cachedSpikeData = null
    baseGroup = null
    spikesGroup = null
    svg = null
    projection = null
    path = null
  })
</script>

<script lang="ts">
  export default {
    name: 'D3Globe3D'
  }
</script>
