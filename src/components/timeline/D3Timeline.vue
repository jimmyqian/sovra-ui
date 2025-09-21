<template>
  <div ref="timelineContainer" class="w-full h-full bg-bg-primary"></div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch } from 'vue'
  import * as d3 from 'd3'

  interface TimelineEvent {
    year: number
    title: string
    category: string
  }

  interface Props {
    events: TimelineEvent[]
  }

  const props = defineProps<Props>()

  const timelineContainer = ref<HTMLElement | null>(null)
  let svg: d3.Selection<d3.BaseType, unknown, null, undefined> | null = null
  let resizeObserver: globalThis.ResizeObserver | null = null

  /**
   * Creates and renders the D3 world history timeline visualization with separate lines per category
   */
  const createTimeline = (): void => {
    if (!timelineContainer.value || !props.events.length) return

    // Clear any existing content
    d3.select(timelineContainer.value).selectAll('*').remove()

    const container = timelineContainer.value
    const margin = { top: 80, right: 40, bottom: 60, left: 120 }
    const width = container.clientWidth - margin.left - margin.right
    const height = container.clientHeight - margin.top - margin.bottom

    if (width <= 0 || height <= 0) return

    // Create SVG
    svg = d3
      .select(container)
      .append('svg')
      .attr('width', container.clientWidth)
      .attr('height', container.clientHeight)

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Scales
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(props.events, d => d.year) as [number, number])
      .range([0, width])

    const categories = ['fishing', 'camping', 'racing', 'whining']
    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(categories)
      .range(['#3B82F6', '#10B981', '#F59E0B', '#EF4444'])

    // Calculate positions for each category line
    const lineSpacing = height / (categories.length + 1)
    const categoryPositions = categories.map((_, i) => (i + 1) * lineSpacing)

    // Create timeline axis at bottom
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'))
    g.append('g')
      .attr('transform', `translate(0,${height + 20})`)
      .call(xAxis)
      .selectAll('text')
      .style('fill', 'rgb(156 163 175)')
      .style('font-size', '12px')

    // Add category lines and labels
    categories.forEach((category, i) => {
      const yPos = categoryPositions[i]

      // Add timeline line for this category
      g.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', yPos)
        .attr('y2', yPos)
        .attr('stroke', colorScale(category))
        .attr('stroke-width', 2)
        .attr('opacity', 0.6)

      // Add category label on the left
      g.append('text')
        .attr('x', -20)
        .attr('y', yPos)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'end')
        .style('fill', colorScale(category))
        .style('font-size', '14px')
        .style('font-weight', '600')
        .style('text-transform', 'capitalize')
        .text(category)
    })

    // Group events by category
    const eventsByCategory = d3.group(props.events, d => d.category)

    // Create events for each category
    categories.forEach((category, categoryIndex) => {
      const categoryEvents = eventsByCategory.get(category) ?? []
      const yPos = categoryPositions[categoryIndex]

      const events = g
        .selectAll(`.event-${category}`)
        .data(categoryEvents)
        .enter()
        .append('g')
        .attr('class', `event event-${category}`)
        .attr('transform', d => `translate(${xScale(d.year)},${yPos})`)

      // Add event dots
      events
        .append('circle')
        .attr('r', 6)
        .attr('fill', colorScale(category))
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer')

      // Add event lines pointing up/down alternately
      events
        .append('line')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', 0)
        .attr('y2', (_, i) => (i % 2 === 0 ? -40 : 40))
        .attr('stroke', colorScale(category))
        .attr('stroke-width', 1)
        .attr('opacity', 0.7)

      // Add event labels
      const labels = events
        .append('text')
        .attr('x', 0)
        .attr('y', (_, i) => (i % 2 === 0 ? -50 : 55))
        .attr('text-anchor', 'middle')
        .style('fill', 'rgb(229 231 235)')
        .style('font-size', '10px')
        .style('font-weight', '500')
        .style('cursor', 'pointer')

      // Split long titles into multiple lines
      labels.each(function (d) {
        const text = d3.select(this)
        const words = d.title.split(/\s+/)
        const lineHeight = 1.1
        const maxWidth = 100

        text.text(null)

        let line: string[] = []
        let tspan = text.append('tspan').attr('x', 0).attr('dy', 0)

        words.forEach(word => {
          line.push(word)
          tspan.text(line.join(' '))

          if (
            (tspan.node()?.getComputedTextLength() ?? 0) > maxWidth &&
            line.length > 1
          ) {
            line.pop()
            tspan.text(line.join(' '))
            line = [word]
            tspan = text
              .append('tspan')
              .attr('x', 0)
              .attr('dy', `${lineHeight}em`)
              .text(word)
          }
        })
      })

      // Add hover effects for this category's events
      events.on('mouseenter', function (event, d) {
        d3.select(this).select('circle').transition().duration(200).attr('r', 8)

        // Show tooltip with description
        const tooltip = g
          .append('g')
          .attr('class', 'tooltip')
          .attr('transform', `translate(${xScale(d.year)},${yPos - 120})`)

        const text = tooltip
          .append('text')
          .attr('fill', 'rgb(229 231 235)')
          .attr('font-size', '12px')
          .attr('text-anchor', 'middle')

        // Add year
        text
          .append('tspan')
          .attr('x', 0)
          .attr('dy', '1.2em')
          .attr('font-weight', 'bold')
          .attr('font-size', '14px')
          .text(`${d.year}`)

        // Add title/description with word wrapping
        const words = d.title.split(/\s+/)
        const maxWidth = 200
        const lineHeight = 1.2
        let line: string[] = []
        let lineNumber = 1

        words.forEach(word => {
          line.push(word)
          const testLine = line.join(' ')

          // Create a temporary tspan to measure text width
          const tempTspan = text
            .append('tspan')
            .attr('x', 0)
            .attr('dy', 0)
            .text(testLine)
            .style('opacity', 0)

          const textWidth = tempTspan.node()?.getComputedTextLength() ?? 0
          tempTspan.remove()

          if (textWidth > maxWidth && line.length > 1) {
            // Line is too long, create previous line and start new one
            line.pop()
            text
              .append('tspan')
              .attr('x', 0)
              .attr('dy', `${lineHeight}em`)
              .text(line.join(' '))

            line = [word]
            lineNumber++
          }
        })

        // Add the last line
        if (line.length > 0) {
          text
            .append('tspan')
            .attr('x', 0)
            .attr('dy', `${lineHeight}em`)
            .text(line.join(' '))
        }

        // Add category at the bottom
        text
          .append('tspan')
          .attr('x', 0)
          .attr('dy', '1.8em')
          .attr('font-size', '10px')
          .attr('fill', colorScale(category))
          .attr('font-weight', '600')
          .style('text-transform', 'uppercase')
          .text(d.category)

        // Create background rectangle after text is positioned
        const bbox = text.node()?.getBBox()
        if (bbox) {
          const rect = tooltip
            .insert('rect', ':first-child')
            .attr('x', bbox.x - 12)
            .attr('y', bbox.y - 8)
            .attr('width', bbox.width + 24)
            .attr('height', bbox.height + 16)
            .attr('fill', 'rgb(31 41 55)')
            .attr('stroke', colorScale(category))
            .attr('stroke-width', 2)
            .attr('rx', 6)
            .attr('opacity', 0.95)
            .style('filter', 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))')
        }
      })

      events.on('mouseleave', function () {
        d3.select(this).select('circle').transition().duration(200).attr('r', 6)

        g.select('.tooltip').remove()
      })
    })

    // Add main title
    svg
      .append('text')
      .attr('x', container.clientWidth / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .style('fill', 'rgb(229 231 235)')
      .style('font-size', '18px')
      .style('font-weight', '600')
      .text('Timeline by Category')
  }

  /**
   * Handles window resize to redraw timeline
   */
  const handleResize = (): void => {
    createTimeline()
  }

  onMounted(() => {
    createTimeline()

    // Set up resize observer
    if (timelineContainer.value) {
      resizeObserver = new globalThis.ResizeObserver(handleResize)
      resizeObserver.observe(timelineContainer.value)
    }
  })

  onUnmounted(() => {
    if (resizeObserver) {
      resizeObserver.disconnect()
    }
  })

  watch(
    () => props.events,
    () => {
      createTimeline()
    },
    { deep: true }
  )
</script>

<script lang="ts">
  export default {
    name: 'D3Timeline'
  }
</script>
