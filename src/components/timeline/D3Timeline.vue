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
    orientation?: 'horizontal' | 'vertical'
  }

  const props = withDefaults(defineProps<Props>(), {
    orientation: 'horizontal'
  })

  const timelineContainer = ref<HTMLElement | null>(null)
  let svg: d3.Selection<SVGSVGElement, unknown, null, undefined> | null = null
  let resizeObserver: globalThis.ResizeObserver | null = null

  /**
   * Creates and renders the D3 world history timeline visualization with separate lines per category
   */
  const createTimeline = (): void => {
    if (!timelineContainer.value || !props.events.length) return

    // Clear any existing content
    d3.select(timelineContainer.value).selectAll('*').remove()

    const container = timelineContainer.value
    const isVertical = props.orientation === 'vertical'

    const margin = isVertical
      ? { top: 60, right: 120, bottom: 40, left: 80 }
      : { top: 80, right: 40, bottom: 60, left: 120 }

    const width = container.clientWidth - margin.left - margin.right
    const height = container.clientHeight - margin.top - margin.bottom

    if (width <= 0 || height <= 0) return

    // Create SVG
    svg = d3
      .select(container)
      .append('svg')
      .attr('width', container.clientWidth)
      .attr('height', container.clientHeight)

    if (!svg) return

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Scales - swap axes for vertical orientation
    const yearExtent = d3.extent(props.events, d => d.year) as [number, number]
    const primaryScale = d3
      .scaleLinear()
      .domain(yearExtent)
      .range(isVertical ? [height, 0] : [0, width])

    const categories = [
      'fishing',
      'camping',
      'racing',
      'whining',
      'gourmet cooking'
    ]
    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(categories)
      .range(['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'])

    // Calculate positions for each category line
    const lineSpacing = (isVertical ? width : height) / (categories.length + 1)
    const categoryPositions = categories.map((_, i) => (i + 1) * lineSpacing)

    // Create timeline axis
    const axis = isVertical
      ? d3.axisLeft(primaryScale).tickFormat(d3.format('d'))
      : d3.axisBottom(primaryScale).tickFormat(d3.format('d'))
    const axisTransform = isVertical
      ? `translate(-20, 0)`
      : `translate(0,${height + 20})`

    g.append('g')
      .attr('transform', axisTransform)
      .call(axis)
      .selectAll('text')
      .style('fill', 'rgb(156 163 175)')
      .style('font-size', '12px')

    // Add category lines and labels
    categories.forEach((category, i) => {
      const categoryPos = categoryPositions[i] ?? 0

      // Add timeline line for this category
      if (isVertical) {
        g.append('line')
          .attr('x1', categoryPos)
          .attr('x2', categoryPos)
          .attr('y1', 0)
          .attr('y2', height)
          .attr('stroke', colorScale(category))
          .attr('stroke-width', 2)
          .attr('opacity', 0.6)

        // Add category label at the top
        g.append('text')
          .attr('x', categoryPos)
          .attr('y', -20)
          .attr('text-anchor', 'middle')
          .style('fill', colorScale(category))
          .style('font-size', '14px')
          .style('font-weight', '600')
          .style('text-transform', 'capitalize')
          .text(category)
      } else {
        g.append('line')
          .attr('x1', 0)
          .attr('x2', width)
          .attr('y1', categoryPos)
          .attr('y2', categoryPos)
          .attr('stroke', colorScale(category))
          .attr('stroke-width', 2)
          .attr('opacity', 0.6)

        // Add category label on the left
        g.append('text')
          .attr('x', -20)
          .attr('y', categoryPos)
          .attr('dy', '0.35em')
          .attr('text-anchor', 'end')
          .style('fill', colorScale(category))
          .style('font-size', '14px')
          .style('font-weight', '600')
          .style('text-transform', 'capitalize')
          .text(category)
      }
    })

    // Group events by category
    const eventsByCategory = d3.group(props.events, d => d.category)

    // Create events for each category
    categories.forEach((category, categoryIndex) => {
      const categoryEvents = eventsByCategory.get(category) ?? []
      const categoryPos = categoryPositions[categoryIndex] ?? 0

      const events = g
        .selectAll(`.event-${category}`)
        .data(categoryEvents)
        .enter()
        .append('g')
        .attr('class', `event event-${category}`)
        .attr('transform', (d: TimelineEvent) =>
          isVertical
            ? `translate(${categoryPos},${primaryScale(d.year)})`
            : `translate(${primaryScale(d.year)},${categoryPos})`
        )

      // Add event dots
      events
        .append('circle')
        .attr('r', 6)
        .attr('fill', colorScale(category))
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer')

      // Add event lines pointing left/right for vertical, up/down for horizontal
      events
        .append('line')
        .attr('x1', 0)
        .attr(
          'x2',
          isVertical
            ? (_: TimelineEvent, i: number) => (i % 2 === 0 ? -40 : 40)
            : 0
        )
        .attr('y1', 0)
        .attr(
          'y2',
          isVertical
            ? 0
            : (_: TimelineEvent, i: number) => (i % 2 === 0 ? -40 : 40)
        )
        .attr('stroke', colorScale(category))
        .attr('stroke-width', 1)
        .attr('opacity', 0.7)

      // Add event labels
      const labels = events
        .append('text')
        .attr(
          'x',
          isVertical
            ? (_: TimelineEvent, i: number) => (i % 2 === 0 ? -50 : 55)
            : 0
        )
        .attr(
          'y',
          isVertical
            ? 0
            : (_: TimelineEvent, i: number) => (i % 2 === 0 ? -50 : 55)
        )
        .attr(
          'text-anchor',
          isVertical
            ? (_: TimelineEvent, i: number) => (i % 2 === 0 ? 'end' : 'start')
            : 'middle'
        )
        .style('fill', 'rgb(0 0 0)')
        .style('font-size', '10px')
        .style('font-weight', '500')
        .style('cursor', 'pointer')

      // Split long titles into multiple lines
      labels.each(function (d: TimelineEvent) {
        const text = d3.select(this as SVGTextElement)
        const words = d.title.split(/\s+/)
        const lineHeight = 1.1
        const maxWidth = isVertical ? 80 : 100

        text.text(null)

        let line: string[] = []
        let tspan = text.append('tspan').attr('x', text.attr('x')).attr('dy', 0)

        words.forEach((word: string) => {
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
              .attr('x', text.attr('x'))
              .attr('dy', `${lineHeight}em`)
              .text(word)
          }
        })
      })

      // Add hover effects for this category's events
      events.on('mouseenter', function (_: unknown, d: TimelineEvent) {
        d3.select(this as SVGGElement)
          .select('circle')
          .transition()
          .duration(200)
          .attr('r', 8)

        // Show tooltip with description
        const tooltipX = isVertical ? categoryPos : primaryScale(d.year)
        const tooltipY = isVertical
          ? primaryScale(d.year) - 120
          : categoryPos - 120

        const tooltip = g
          .append('g')
          .attr('class', 'tooltip')
          .attr('transform', `translate(${tooltipX},${tooltipY})`)

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

        words.forEach((word: string) => {
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
          tooltip
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
        d3.select(this as SVGGElement)
          .select('circle')
          .transition()
          .duration(200)
          .attr('r', 6)

        g.select('.tooltip').remove()
      })
    })

    // Add main title
    svg
      ?.append('text')
      .attr('x', container.clientWidth / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .style('fill', 'rgb(229 231 235)')
      .style('font-size', '18px')
      .style('font-weight', '600')
      .text(`Timeline by Category (${isVertical ? 'Vertical' : 'Horizontal'})`)
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

  watch(
    () => props.orientation,
    () => {
      createTimeline()
    }
  )
</script>

<script lang="ts">
  export default {
    name: 'D3Timeline'
  }
</script>
