<template>
  <div
    class="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
  >
    <div class="p-4 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
      <p v-if="subtitle" class="text-sm text-gray-600 mt-1">{{ subtitle }}</p>
    </div>
    <div ref="chartContainer" class="p-4" :style="{ height: `${height}px` }">
      <svg ref="svgRef" :width="width" :height="height"></svg>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import * as d3 from 'd3'

  interface SentimentData {
    month: string
    narcissistic: number
    volatile: number
    positive: number
  }

  interface Props {
    title: string
    subtitle?: string
    data: SentimentData[]
    width?: number
    height?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    subtitle: undefined,
    width: 800,
    height: 300
  })

  const svgRef = ref<SVGSVGElement | null>(null)

  const renderChart = () => {
    if (!svgRef.value || props.data.length === 0) return

    const svg = d3.select(svgRef.value)
    svg.selectAll('*').remove()

    const margin = { top: 20, right: 120, bottom: 40, left: 60 }
    const innerWidth = props.width - margin.left - margin.right
    const innerHeight = props.height - margin.top - margin.bottom

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Create scales
    const xScale = d3
      .scaleBand()
      .domain(props.data.map(d => d.month))
      .range([0, innerWidth])
      .padding(0.1)

    const yScale = d3.scaleLinear().domain([0, 100]).range([innerHeight, 0])

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('fill', '#6b7280')

    g.append('g')
      .call(
        d3
          .axisLeft(yScale)
          .ticks(5)
          .tickFormat(d => `${d}%`)
      )
      .attr('color', '#6b7280')

    // Define the lines
    const lineNarcissistic = d3
      .line<SentimentData>()
      .x(d => (xScale(d.month) ?? 0) + xScale.bandwidth() / 2)
      .y(d => yScale(d.narcissistic))

    const lineVolatile = d3
      .line<SentimentData>()
      .x(d => (xScale(d.month) ?? 0) + xScale.bandwidth() / 2)
      .y(d => yScale(d.volatile))

    const linePositive = d3
      .line<SentimentData>()
      .x(d => (xScale(d.month) ?? 0) + xScale.bandwidth() / 2)
      .y(d => yScale(d.positive))

    // Add lines
    g.append('path')
      .datum(props.data)
      .attr('fill', 'none')
      .attr('stroke', '#8b5cf6')
      .attr('stroke-width', 3)
      .attr('d', lineNarcissistic)

    g.append('path')
      .datum(props.data)
      .attr('fill', 'none')
      .attr('stroke', '#ef4444')
      .attr('stroke-width', 3)
      .attr('d', lineVolatile)

    g.append('path')
      .datum(props.data)
      .attr('fill', 'none')
      .attr('stroke', '#10b981')
      .attr('stroke-width', 3)
      .attr('d', linePositive)

    // Add dots for narcissistic
    g.selectAll('.dot-narcissistic')
      .data(props.data)
      .join('circle')
      .attr('class', 'dot-narcissistic')
      .attr('cx', d => (xScale(d.month) ?? 0) + xScale.bandwidth() / 2)
      .attr('cy', d => yScale(d.narcissistic))
      .attr('r', 4)
      .attr('fill', '#8b5cf6')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)

    // Add dots for volatile
    g.selectAll('.dot-volatile')
      .data(props.data)
      .join('circle')
      .attr('class', 'dot-volatile')
      .attr('cx', d => (xScale(d.month) ?? 0) + xScale.bandwidth() / 2)
      .attr('cy', d => yScale(d.volatile))
      .attr('r', 4)
      .attr('fill', '#ef4444')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)

    // Add dots for positive
    g.selectAll('.dot-positive')
      .data(props.data)
      .join('circle')
      .attr('class', 'dot-positive')
      .attr('cx', d => (xScale(d.month) ?? 0) + xScale.bandwidth() / 2)
      .attr('cy', d => yScale(d.positive))
      .attr('r', 4)
      .attr('fill', '#10b981')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)

    // Add legend
    const legend = g
      .append('g')
      .attr('transform', `translate(${innerWidth + 20}, 0)`)

    const legendData = [
      { label: 'Narcissistic Posts', color: '#8b5cf6' },
      { label: 'Volatile/Angry Posts', color: '#ef4444' },
      { label: 'Positive Posts', color: '#10b981' }
    ]

    legendData.forEach((item, i) => {
      const legendRow = legend
        .append('g')
        .attr('transform', `translate(0, ${i * 25})`)

      legendRow
        .append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 5)
        .attr('fill', item.color)

      legendRow
        .append('text')
        .attr('x', 12)
        .attr('y', 4)
        .attr('font-size', '11px')
        .attr('fill', '#374151')
        .text(item.label)
    })

    // Add labels
    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 35)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#6b7280')
      .text('Month')

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -45)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#6b7280')
      .text('Post Sentiment (%)')
  }

  onMounted(() => {
    renderChart()
  })

  watch(() => props.data, renderChart, { deep: true })
</script>
