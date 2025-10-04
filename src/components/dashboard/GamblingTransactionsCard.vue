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

  interface Transaction {
    date: string
    amount: number
    description: string
    category: 'win' | 'loss'
  }

  interface Props {
    title: string
    subtitle?: string
    transactions: Transaction[]
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
    if (!svgRef.value || props.transactions.length === 0) return

    const svg = d3.select(svgRef.value)
    svg.selectAll('*').remove()

    const margin = { top: 20, right: 30, bottom: 40, left: 60 }
    const innerWidth = props.width - margin.left - margin.right
    const innerHeight = props.height - margin.top - margin.bottom

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Parse dates and calculate cumulative sum
    const data = props.transactions.map(d => ({
      ...d,
      date: new Date(d.date)
    }))

    let cumulative = 0
    const cumulativeData = data.map(d => {
      cumulative += d.amount
      return { ...d, cumulative }
    })

    // Create scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(cumulativeData, d => d.date) as [Date, Date])
      .range([0, innerWidth])

    const yScale = d3
      .scaleLinear()
      .domain([
        Math.min(d3.min(cumulativeData, d => d.cumulative) ?? 0, 0),
        Math.max(d3.max(cumulativeData, d => d.cumulative) ?? 0, 0)
      ])
      .range([innerHeight, 0])

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(6))
      .attr('color', '#6b7280')

    g.append('g')
      .call(
        d3
          .axisLeft(yScale)
          .ticks(5)
          .tickFormat(d => `$${d3.format(',')(d as number)}`)
      )
      .attr('color', '#6b7280')

    // Add zero line
    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', yScale(0))
      .attr('y2', yScale(0))
      .attr('stroke', '#9ca3af')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4')

    // Create line
    const line = d3
      .line<(typeof cumulativeData)[0]>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.cumulative))

    // Add area fill - red for losses, green for wins
    const area = d3
      .area<(typeof cumulativeData)[0]>()
      .x(d => xScale(d.date))
      .y0(yScale(0))
      .y1(d => yScale(d.cumulative))

    g.append('path')
      .datum(cumulativeData)
      .attr('fill', d => {
        const lastValue = d[d.length - 1].cumulative
        return lastValue < 0 ? '#fee2e2' : '#dcfce7'
      })
      .attr('d', area)
      .attr('opacity', 0.3)

    // Add line path
    g.append('path')
      .datum(cumulativeData)
      .attr('fill', 'none')
      .attr('stroke', d => {
        const lastValue = d[d.length - 1].cumulative
        return lastValue < 0 ? '#ef4444' : '#10b981'
      })
      .attr('stroke-width', 3)
      .attr('d', line)

    // Add dots for each transaction
    g.selectAll('.dot')
      .data(cumulativeData)
      .join('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(d.date))
      .attr('cy', d => yScale(d.cumulative))
      .attr('r', 5)
      .attr('fill', d => (d.category === 'loss' ? '#ef4444' : '#10b981'))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function () {
        d3.select(this).attr('r', 8)
        if (tooltip) {
          tooltip.style('opacity', 1)
        }
      })
      .on('mouseout', function () {
        d3.select(this).attr('r', 5)
        if (tooltip) {
          tooltip.style('opacity', 0)
        }
      })
      .on('mousemove', function (event, d) {
        if (tooltip) {
          const formattedDate = d3.timeFormat('%b %d, %Y')(d.date)
          const amountColor = d.amount < 0 ? '#ef4444' : '#10b981'
          tooltip
            .html(
              `<strong>${formattedDate}</strong><br/>
               <span style="color: ${amountColor}">${d.amount < 0 ? '-' : '+'}$${Math.abs(d.amount)}</span><br/>
               ${d.description}<br/>
               <strong>Running Total: $${d3.format(',')(d.cumulative)}</strong>`
            )
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 10}px`)
        }
      })

    // Add tooltip
    let tooltip
    if (typeof document !== 'undefined') {
      tooltip = d3
        .select('body')
        .append('div')
        .attr('class', 'gambling-tooltip')
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

    // Add labels
    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 35)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#6b7280')
      .text('Date')

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -45)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#6b7280')
      .text('Net Gambling P/L ($)')

    // Add final balance indicator
    const finalBalance = cumulativeData[cumulativeData.length - 1].cumulative
    const balanceColor = finalBalance < 0 ? '#ef4444' : '#10b981'

    g.append('text')
      .attr('x', innerWidth - 10)
      .attr('y', 15)
      .attr('text-anchor', 'end')
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .attr('fill', balanceColor)
      .text(
        `Total: ${finalBalance < 0 ? '-' : '+'}$${d3.format(',')(Math.abs(finalBalance))}`
      )
  }

  onMounted(() => {
    renderChart()
  })

  watch(() => props.transactions, renderChart, { deep: true })
</script>
