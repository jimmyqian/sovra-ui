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

  // Simple versor implementation for 3D rotation
  const versor = {
    // Convert spherical coordinates to cartesian
    cartesian: (coordinates: [number, number]): [number, number, number] => {
      const [longitude, latitude] = coordinates
      const lambda = (longitude * Math.PI) / 180
      const phi = (latitude * Math.PI) / 180
      return [
        Math.cos(phi) * Math.cos(lambda),
        Math.cos(phi) * Math.sin(lambda),
        Math.sin(phi)
      ]
    },

    // Create quaternion from rotation angles
    fromRotation: (
      rotation: [number, number, number]
    ): [number, number, number, number] => {
      const [yaw, pitch, roll] = rotation.map(
        (d: number) => (d * Math.PI) / 360
      ) as [number, number, number]
      const cy = Math.cos(yaw)
      const sy = Math.sin(yaw)
      const cp = Math.cos(pitch)
      const sp = Math.sin(pitch)
      const cr = Math.cos(roll)
      const sr = Math.sin(roll)

      return [
        cr * cp * cy + sr * sp * sy,
        sr * cp * cy - cr * sp * sy,
        cr * sp * cy + sr * cp * sy,
        cr * cp * sy - sr * sp * cy
      ]
    },

    // Convert quaternion to rotation angles
    toRotation: (
      q: [number, number, number, number]
    ): [number, number, number] => {
      const [w, x, y, z] = q
      return [
        (Math.atan2(2 * (w * z + x * y), 1 - 2 * (y * y + z * z)) * 180) /
          Math.PI,
        (Math.asin(Math.max(-1, Math.min(1, 2 * (w * y - z * x)))) * 180) /
          Math.PI,
        (Math.atan2(2 * (w * x + y * z), 1 - 2 * (x * x + y * y)) * 180) /
          Math.PI
      ]
    },

    // Multiply two quaternions
    multiply: (
      a: [number, number, number, number],
      b: [number, number, number, number]
    ): [number, number, number, number] => {
      const [aw, ax, ay, az] = a
      const [bw, bx, by, bz] = b
      return [
        aw * bw - ax * bx - ay * by - az * bz,
        aw * bx + ax * bw + ay * bz - az * by,
        aw * by - ax * bz + ay * bw + az * bx,
        aw * bz + ax * by - ay * bx + az * bw
      ]
    },

    // Calculate delta between two 3D points
    delta: (
      v0: [number, number, number],
      v1: [number, number, number]
    ): [number, number, number, number] => {
      const dot = v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2]
      const cross = [
        v0[1] * v1[2] - v0[2] * v1[1],
        v0[2] * v1[0] - v0[0] * v1[2],
        v0[0] * v1[1] - v0[1] * v1[0]
      ] as [number, number, number]
      const w = 1 + dot
      return w ? [w, cross[0], cross[1], cross[2]] : [0, 1, 0, 0]
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
   * Updates only the rotating elements (spikes and geography) without full re-render
   * This is the key performance optimization
   */
  const updateRotation = () => {
    if (!projection || !path || !baseGroup || !spikesGroup) return

    // Update base geography
    baseGroup.selectAll('path').attr('d', path as unknown as string)

    // Update spikes positions
    const spikeData = generateSpikeData()
    spikesGroup.selectAll('.spike').each(function (_, i) {
      const spike = spikeData[i]
      if (!spike || !projection) return

      const coords = projection([spike.longitude, spike.latitude])
      if (!coords) return

      const [x, y] = coords
      const spikeSelection = d3.select(this as SVGGElement)

      // Update spike line
      spikeSelection
        .select('line')
        .attr('x1', x)
        .attr('y1', y)
        .attr('x2', x)
        .attr('y2', y - spike.height)

      // Update spike base circle
      spikeSelection.select('.spike-base').attr('cx', x).attr('cy', y)

      // Update spike top circle
      spikeSelection
        .select('.spike-top')
        .attr('cx', x)
        .attr('cy', y - spike.height)
    })
  }

  /**
   * Creates optimized drag behavior with throttling and smooth updates
   */
  const createDragBehavior = () => {
    if (!projection) return null

    let v0: [number, number, number] | null = null
    let r0: [number, number, number] = [0, 0, 0]
    let q0: [number, number, number, number] = [1, 0, 0, 0]

    const dragstarted = (
      event: d3.D3DragEvent<SVGSVGElement, unknown, unknown>
    ) => {
      const coords = projection?.invert?.([event.x, event.y])
      if (coords && projection) {
        v0 = versor.cartesian(coords)
        r0 = projection.rotate() as [number, number, number]
        q0 = versor.fromRotation(r0)
      }
    }

    const dragged = (
      event: d3.D3DragEvent<SVGSVGElement, unknown, unknown>
    ) => {
      if (!v0 || !projection) return

      // Cancel any pending animation frame
      if (dragAnimationFrame) {
        globalThis.cancelAnimationFrame(dragAnimationFrame)
      }

      // Schedule update for next animation frame (throttling)
      dragAnimationFrame = globalThis.requestAnimationFrame(() => {
        if (!projection || !v0) return

        const coords = projection.rotate(r0).invert?.([event.x, event.y])
        if (coords) {
          const v1 = versor.cartesian(coords)
          const delta = versor.delta(v0, v1)
          const q1 = versor.multiply(q0, delta)
          const rotation = versor.toRotation(q1)

          projection.rotate(rotation)
          updateRotation() // Use optimized update instead of full render
        }
      })
    }

    const dragended = () => {
      // Clean up
      if (dragAnimationFrame) {
        globalThis.cancelAnimationFrame(dragAnimationFrame)
        dragAnimationFrame = null
      }
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

    // Create spike elements once
    if (spikesGroup) {
      spikeData.forEach(spike => {
        const coords = projection?.([spike.longitude, spike.latitude])
        if (!coords) return

        const [x, y] = coords
        const spikeGroup = spikesGroup!.append('g').attr('class', 'spike')

        // Draw spike line
        spikeGroup
          .append('line')
          .attr('x1', x)
          .attr('y1', y)
          .attr('x2', x)
          .attr('y2', y - spike.height)
          .attr('stroke', 'var(--color-brand-orange)')
          .attr('stroke-width', 2)
          .attr('opacity', 0.9)

        // Draw spike base
        spikeGroup
          .append('circle')
          .attr('class', 'spike-base')
          .attr('cx', x)
          .attr('cy', y)
          .attr('r', 3)
          .attr('fill', 'var(--color-brand-orange)')
          .attr('opacity', 0.8)

        // Draw spike top
        spikeGroup
          .append('circle')
          .attr('class', 'spike-top')
          .attr('cx', x)
          .attr('cy', y - spike.height)
          .attr('r', 4)
          .attr('fill', 'var(--color-brand-orange)')
          .attr('opacity', 1)
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
