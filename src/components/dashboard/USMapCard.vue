<template>
  <div
    class="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
  >
    <div class="p-4 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
      <p v-if="subtitle" class="text-sm text-gray-600 mt-1">{{ subtitle }}</p>
    </div>
    <div ref="mapContainer" class="p-4" :style="{ height: `${height}px` }">
      <svg ref="svgRef" :width="width" :height="height"></svg>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import * as d3 from 'd3'
  import { feature } from 'topojson-client'
  import type { Topology, GeometryCollection } from 'topojson-specification'

  interface Location {
    city: string
    state: string
    lat: number
    lon: number
    years?: string
    description?: string
  }

  interface Props {
    title: string
    subtitle?: string
    locations: Location[]
    width?: number
    height?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    subtitle: undefined,
    width: 800,
    height: 500
  })

  const svgRef = ref<SVGSVGElement | null>(null)

  const renderMap = async () => {
    if (!svgRef.value) return

    const svg = d3.select(svgRef.value)
    svg.selectAll('*').remove()

    // Set up projection for US map
    const projection = d3
      .geoAlbersUsa()
      .scale(props.width * 1.3)
      .translate([props.width / 2, props.height / 2])

    const path = d3.geoPath().projection(projection)

    const g = svg.append('g')

    // Load US TopoJSON data
    try {
      const us = (await d3.json(
        'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json'
      )) as Topology

      // Draw states
      const states = feature(us, us.objects.states as GeometryCollection)

      g.selectAll('path')
        .data(states.features)
        .join('path')
        .attr('d', path)
        .attr('fill', '#e5e7eb')
        .attr('stroke', '#9ca3af')
        .attr('stroke-width', 0.5)
    } catch {
      // Fallback to simplified representation if TopoJSON fails to load
      // TODO: Add proper error handling and user notification
      g.append('rect')
        .attr('x', 50)
        .attr('y', 50)
        .attr('width', props.width - 100)
        .attr('height', props.height - 100)
        .attr('fill', '#f3f4f6')
        .attr('stroke', '#d1d5db')
        .attr('stroke-width', 2)
        .attr('rx', 8)
    }

    // Plot locations
    props.locations.forEach(location => {
      const coords = projection([location.lon, location.lat])
      if (!coords) return

      const [x, y] = coords

      // Location marker circle
      g.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 8)
        .attr('fill', '#ef4444')
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer')
        .on('mouseover', function () {
          d3.select(this).attr('r', 12).attr('stroke-width', 3)
          if (tooltip) {
            tooltip.style('opacity', 1)
          }
        })
        .on('mouseout', function () {
          d3.select(this).attr('r', 8).attr('stroke-width', 2)
          if (tooltip) {
            tooltip.style('opacity', 0)
          }
        })
        .on('mousemove', function (event) {
          if (tooltip) {
            tooltip
              .html(
                `<strong>${location.city}, ${location.state}</strong><br/>${location.years ?? ''}<br/>${location.description ?? ''}`
              )
              .style('left', `${event.pageX + 10}px`)
              .style('top', `${event.pageY - 10}px`)
          }
        })

      // Pulse animation
      g.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 8)
        .attr('fill', 'none')
        .attr('stroke', '#ef4444')
        .attr('stroke-width', 2)
        .attr('opacity', 0.6)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr('r', 20)
        .attr('opacity', 0)
        .on('end', function repeat() {
          d3.select(this)
            .attr('r', 8)
            .attr('opacity', 0.6)
            .transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .attr('r', 20)
            .attr('opacity', 0)
            .on('end', repeat)
        })

      // City label
      g.append('text')
        .attr('x', x)
        .attr('y', y - 15)
        .attr('text-anchor', 'middle')
        .attr('font-size', '11px')
        .attr('font-weight', '600')
        .attr('fill', '#1f2937')
        .text(location.city)
    })

    // Add tooltip div (only in browser environment)
    let tooltip
    if (typeof document !== 'undefined') {
      tooltip = d3
        .select('body')
        .append('div')
        .attr('class', 'map-tooltip')
        .style('position', 'absolute')
        .style('background', 'white')
        .style('border', '1px solid #d1d5db')
        .style('border-radius', '4px')
        .style('padding', '8px')
        .style('font-size', '12px')
        .style('pointer-events', 'none')
        .style('opacity', 0)
        .style('z-index', '1000')
        .style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)')
    }
  }

  onMounted(() => {
    renderMap()
  })

  watch(() => props.locations, renderMap, { deep: true })
</script>
