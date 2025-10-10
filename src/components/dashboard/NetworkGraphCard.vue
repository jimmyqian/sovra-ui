<template>
  <div
    class="bg-white rounded-2xl shadow-lg-modern border border-slate-100 hover:shadow-xl-modern transition-all overflow-hidden"
    :class="{ 'col-span-2': expanded }"
  >
    <div
      class="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white"
    >
      <h3 class="text-xl font-bold text-slate-900">{{ title }}</h3>
      <p v-if="subtitle" class="text-sm text-slate-600 mt-1 font-medium">
        {{ subtitle }}
      </p>
    </div>
    <div
      ref="graphContainer"
      class="p-4 flex items-center justify-center"
      :style="{ height: `${height}px` }"
    >
      <svg ref="svgRef" :width="width" :height="height"></svg>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import * as d3 from 'd3'

  interface Node {
    id: string
    name: string
    type: 'primary' | 'family' | 'associate'
    image?: string
  }

  interface Link {
    source: string
    target: string
    relationship: string
  }

  interface Props {
    title: string
    subtitle?: string
    nodes: Node[]
    links: Link[]
    width?: number
    height?: number
    expanded?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    subtitle: undefined,
    width: 600,
    height: 400
  })

  const emit = defineEmits<{
    toggleExpand: []
    nodeClick: [nodeId: string]
  }>()

  const svgRef = ref<SVGSVGElement | null>(null)

  const renderGraph = () => {
    if (!svgRef.value) return

    const svg = d3.select(svgRef.value)
    svg.selectAll('*').remove()

    const simulation = d3
      .forceSimulation(props.nodes as d3.SimulationNodeDatum[])
      .force(
        'link',
        d3
          .forceLink(props.links)
          .id((d: d3.SimulationNodeDatum) => (d as Node).id)
          .distance(100)
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(props.width / 2, props.height / 2))

    // Links - use green to yellow gradient colors for positive connections
    const link = svg
      .append('g')
      .selectAll('line')
      .data(props.links)
      .join('line')
      .attr('stroke', (d: Link) => {
        // Use green-yellow gradient for connections
        const colorScale = d3
          .scaleOrdinal<string>()
          .range(['#10b981', '#34d399', '#fbbf24', '#facc15'])
        return colorScale(d.relationship)
      })
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.7)

    // Node groups for images
    const nodeGroup = svg
      .append('g')
      .selectAll('g')
      .data(props.nodes)
      .join('g')
      .style('cursor', (d: Node) =>
        d.id === 'preston' ? 'pointer' : 'default'
      )
      .call(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        d3.drag<any, Node>().on('drag', (event, d) => {
          ;(d as d3.SimulationNodeDatum).fx = event.x
          ;(d as d3.SimulationNodeDatum).fy = event.y
          simulation.alpha(0.3).restart()
        })
      )
      .on('click', (event: MouseEvent, d: Node) => {
        // Only emit click event for Preston node
        if (d.id === 'preston') {
          event.stopPropagation()
          emit('nodeClick', d.id)
        }
      })

    // Add circular clip paths for images
    nodeGroup
      .append('clipPath')
      .attr('id', (d: Node) => `clip-${d.id}`)
      .append('circle')
      .attr('r', (d: Node) => (d.type === 'primary' ? 20 : 15))

    // Add images
    nodeGroup
      .append('image')
      .attr('xlink:href', (d: Node) => d.image ?? '')
      .attr('width', (d: Node) => (d.type === 'primary' ? 40 : 30))
      .attr('height', (d: Node) => (d.type === 'primary' ? 40 : 30))
      .attr('x', (d: Node) => (d.type === 'primary' ? -20 : -15))
      .attr('y', (d: Node) => (d.type === 'primary' ? -20 : -15))
      .attr('clip-path', (d: Node) => `url(#clip-${d.id})`)

    // Add border circles
    nodeGroup
      .append('circle')
      .attr('r', (d: Node) => (d.type === 'primary' ? 20 : 15))
      .attr('fill', 'none')
      .attr('stroke', (d: Node) => {
        // Highlight Preston with bright red border
        if (d.id === 'preston') {
          return '#ef4444'
        }
        // Use green-yellow colors for all other nodes
        switch (d.type) {
          case 'primary':
            return '#10b981'
          case 'family':
            return '#34d399'
          case 'associate':
            return '#fbbf24'
          default:
            return '#facc15'
        }
      })
      .attr('stroke-width', (d: Node) => (d.id === 'preston' ? 4 : 3))

    // Labels
    const labels = svg
      .append('g')
      .selectAll('text')
      .data(props.nodes)
      .join('text')
      .text((d: Node) => d.name)
      .attr('font-size', 12)
      .attr('dx', 25)
      .attr('dy', 4)
      .attr('fill', '#1f2937')
      .attr('font-weight', (d: Node) => (d.type === 'primary' ? 600 : 400))

    simulation.on('tick', () => {
      link
        .attr(
          'x1',
          (d: d3.SimulationLinkDatum<Node>) =>
            (d.source as d3.SimulationNodeDatum).x ?? 0
        )
        .attr(
          'y1',
          (d: d3.SimulationLinkDatum<Node>) =>
            (d.source as d3.SimulationNodeDatum).y ?? 0
        )
        .attr(
          'x2',
          (d: d3.SimulationLinkDatum<Node>) =>
            (d.target as d3.SimulationNodeDatum).x ?? 0
        )
        .attr(
          'y2',
          (d: d3.SimulationLinkDatum<Node>) =>
            (d.target as d3.SimulationNodeDatum).y ?? 0
        )

      nodeGroup.attr(
        'transform',
        (d: d3.SimulationNodeDatum) => `translate(${d.x ?? 0},${d.y ?? 0})`
      )

      labels
        .attr('x', (d: d3.SimulationNodeDatum) => d.x ?? 0)
        .attr('y', (d: d3.SimulationNodeDatum) => d.y ?? 0)
    })
  }

  onMounted(() => {
    renderGraph()
  })

  watch(() => [props.nodes, props.links], renderGraph, { deep: true })
</script>
