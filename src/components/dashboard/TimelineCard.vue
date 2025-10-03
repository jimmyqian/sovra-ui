<template>
  <div
    class="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
    :class="{ 'col-span-2': expanded }"
  >
    <div class="p-4 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
      <p v-if="subtitle" class="text-sm text-gray-600 mt-1">{{ subtitle }}</p>
    </div>
    <div ref="timelineContainer" class="p-4" :style="{ height: `${height}px` }">
      <svg ref="svgRef" :width="width" :height="height"></svg>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import * as d3 from 'd3'

  interface TimelineEvent {
    year: number
    label: string
    category:
      | 'education'
      | 'work'
      | 'relationship'
      | 'marriage'
      | 'children'
      | 'location'
    description?: string
  }

  interface Props {
    title: string
    subtitle?: string
    events: TimelineEvent[]
    width?: number
    height?: number
    expanded?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    subtitle: undefined,
    width: 1000,
    height: 300
  })

  defineEmits<{
    toggleExpand: []
  }>()

  const svgRef = ref<SVGSVGElement | null>(null)

  const categoryColors: Record<string, string> = {
    education: '#3b82f6', // blue
    work: '#8b5cf6', // purple
    relationship: '#ec4899', // pink
    marriage: '#ef4444', // red
    children: '#10b981', // green
    location: '#10b981' // green
  }

  const trackCategories = {
    personal: ['children', 'relationship', 'marriage'],
    education: ['education'],
    professional: ['work'],
    location: ['location']
  }

  const renderTimeline = () => {
    if (!svgRef.value) return

    const svg = d3.select(svgRef.value)
    svg.selectAll('*').remove()

    const margin = { top: 40, right: 40, bottom: 40, left: 120 }
    const innerWidth = props.width - margin.left - margin.right
    const innerHeight = props.height - margin.top - margin.bottom

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Create scale
    const years = props.events.map(e => e.year)
    const minYear = Math.min(...years)
    const maxYear = Math.max(...years)

    const xScale = d3
      .scaleLinear()
      .domain([minYear - 1, maxYear + 1])
      .range([0, innerWidth])

    // Define tracks with more vertical spacing
    const tracks = [
      {
        name: 'Personal',
        y: innerHeight * 0.12,
        categories: trackCategories.personal,
        color: '#ec4899'
      },
      {
        name: 'Education',
        y: innerHeight * 0.32,
        categories: trackCategories.education,
        color: '#3b82f6'
      },
      {
        name: 'Professional',
        y: innerHeight * 0.58,
        categories: trackCategories.professional,
        color: '#8b5cf6'
      },
      {
        name: 'Location',
        y: innerHeight * 0.84,
        categories: trackCategories.location,
        color: '#10b981'
      }
    ]

    // Draw tracks
    tracks.forEach(track => {
      // Track label
      g.append('text')
        .attr('x', -10)
        .attr('y', track.y + 5)
        .attr('text-anchor', 'end')
        .attr('font-size', '13px')
        .attr('font-weight', '600')
        .attr('fill', track.color)
        .text(track.name)

      // Track line
      g.append('line')
        .attr('x1', 0)
        .attr('y1', track.y)
        .attr('x2', innerWidth)
        .attr('y2', track.y)
        .attr('stroke', track.color)
        .attr('stroke-width', 2)
        .attr('opacity', 0.3)
    })

    // Draw year markers
    const yearTicks = d3.range(minYear, maxYear + 1, 5)
    yearTicks.forEach(year => {
      const x = xScale(year)
      g.append('line')
        .attr('x1', x)
        .attr('y1', 0)
        .attr('x2', x)
        .attr('y2', innerHeight)
        .attr('stroke', '#e5e7eb')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '2,2')

      g.append('text')
        .attr('x', x)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .attr('font-size', '11px')
        .attr('fill', '#9ca3af')
        .text(year)
    })

    // Draw events on appropriate tracks
    // Group events by track to detect overlaps
    const eventsByTrack = new Map<
      number,
      Array<{ event: TimelineEvent; x: number }>
    >()

    props.events.forEach(event => {
      const track = tracks.find(t => t.categories.includes(event.category))
      if (!track) return

      const x = xScale(event.year)
      const trackY = track.y

      if (!eventsByTrack.has(trackY)) {
        eventsByTrack.set(trackY, [])
      }
      eventsByTrack.get(trackY)?.push({ event, x })
    })

    // Sort events by x position for each track
    eventsByTrack.forEach(events => {
      events.sort((a, b) => a.x - b.x)
    })

    // Draw events with alternating labels to prevent overlap
    eventsByTrack.forEach((events, trackY) => {
      events.forEach((item, index) => {
        const { event, x } = item
        const y = trackY

        // Alternate labels above and below the line
        const labelOffset = index % 2 === 0 ? -25 : 25
        const labelY = y + labelOffset

        // Event circle
        g.append('circle')
          .attr('cx', x)
          .attr('cy', y)
          .attr('r', 6)
          .attr('fill', categoryColors[event.category] ?? '#6b7280')
          .attr('stroke', '#fff')
          .attr('stroke-width', 2)
          .style('cursor', 'pointer')
          .on('mouseover', function () {
            d3.select(this).attr('r', 9).attr('stroke-width', 3)
          })
          .on('mouseout', function () {
            d3.select(this).attr('r', 6).attr('stroke-width', 2)
          })
          .append('title')
          .text(
            `${event.label} (${event.year})${event.description ? `\n${event.description}` : ''}`
          )

        // Connector line from circle to label
        g.append('line')
          .attr('x1', x)
          .attr('y1', y)
          .attr('x2', x)
          .attr('y2', labelY + (labelOffset > 0 ? -8 : 8))
          .attr('stroke', '#d1d5db')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '2,2')

        // Event label
        g.append('text')
          .attr('x', x)
          .attr('y', labelY)
          .attr('text-anchor', 'middle')
          .attr('font-size', '10px')
          .attr('font-weight', '500')
          .attr('fill', '#1f2937')
          .text(event.label)
          .style('cursor', 'pointer')
          .on('mouseover', function () {
            d3.select(this).attr('font-weight', '700').attr('font-size', '11px')
          })
          .on('mouseout', function () {
            d3.select(this).attr('font-weight', '500').attr('font-size', '10px')
          })
      })
    })
  }

  onMounted(() => {
    renderTimeline()
  })

  watch(() => props.events, renderTimeline, { deep: true })
</script>
