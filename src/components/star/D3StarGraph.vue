<template>
  <div ref="starContainer" class="w-full h-full bg-bg-primary"></div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch } from 'vue'
  import * as d3 from 'd3'

  interface StarNode {
    id: string
    label: string
    isHub: boolean
    x?: number
    y?: number
    fx?: number
    fy?: number
  }

  interface StarLink {
    source: string | StarNode
    target: string | StarNode
  }

  interface Props {
    nodeCount?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    nodeCount: 7
  })

  const starContainer = ref<HTMLElement | null>(null)
  let svg: d3.Selection<d3.BaseType, unknown, null, undefined> | null = null
  let simulation: d3.Simulation<StarNode, StarLink> | null = null
  let resizeObserver: globalThis.ResizeObserver | null = null

  /**
   * Generates random nodes with one designated as the hub
   */
  const generateNodes = (): StarNode[] => {
    const nodes: StarNode[] = []
    const hubIndex = Math.floor(Math.random() * props.nodeCount)

    for (let i = 0; i < props.nodeCount; i++) {
      nodes.push({
        id: `node-${i}`,
        label: i === hubIndex ? 'Hub' : `Node ${i}`,
        isHub: i === hubIndex
      })
    }

    return nodes
  }

  /**
   * Generates links connecting all non-hub nodes to the hub
   */
  const generateLinks = (nodes: StarNode[]): StarLink[] => {
    const hub = nodes.find(node => node.isHub)
    if (!hub) return []

    return nodes
      .filter(node => !node.isHub)
      .map(node => ({
        source: hub.id,
        target: node.id
      }))
  }

  /**
   * Creates and renders the D3 star graph visualization
   */
  const createStarGraph = (): void => {
    if (!starContainer.value) return

    // Clear any existing content
    d3.select(starContainer.value).selectAll('*').remove()

    const container = starContainer.value
    const width = container.clientWidth
    const height = container.clientHeight

    if (width <= 0 || height <= 0) return

    // Generate data
    const nodes = generateNodes()
    const links = generateLinks(nodes)

    // Create SVG
    svg = d3
      .select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)

    const g = svg.append('g')

    // Create force simulation
    simulation = d3
      .forceSimulation<StarNode>(nodes)
      .force(
        'link',
        d3
          .forceLink<StarNode, StarLink>(links)
          .id(d => d.id)
          .distance(150)
          .strength(0.8)
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50))

    // Pin the hub node to the center
    const hub = nodes.find(node => node.isHub)
    if (hub) {
      hub.fx = width / 2
      hub.fy = height / 2
    }

    // Create links
    const link = g
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2)

    // Create node groups
    const node = g
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')

    // Add circles for nodes
    node
      .append('circle')
      .attr('r', d => (d.isHub ? 40 : 30))
      .attr('fill', d => (d.isHub ? '#EF4444' : '#3B82F6'))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)

    // Add labels
    node
      .append('text')
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .style('fill', '#fff')
      .style('font-size', d => (d.isHub ? '16px' : '14px'))
      .style('font-weight', '600')
      .style('pointer-events', 'none')
      .text(d => d.label)

    // Add hover effects
    node.on('mouseenter', function (_, d) {
      d3.select(this)
        .select('circle')
        .transition()
        .duration(200)
        .attr('r', d.isHub ? 50 : 40)
        .attr('fill', d.isHub ? '#DC2626' : '#2563EB')
    })

    node.on('mouseleave', function (_, d) {
      d3.select(this)
        .select('circle')
        .transition()
        .duration(200)
        .attr('r', d.isHub ? 40 : 30)
        .attr('fill', d.isHub ? '#EF4444' : '#3B82F6')
    })

    // Add drag behavior (only for non-hub nodes)
    const drag = d3
      .drag<d3.BaseType, StarNode>()
      .on('start', (event, d) => {
        if (!event.active && simulation) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      })
      .on('drag', (event, d) => {
        if (!d.isHub) {
          d.fx = event.x
          d.fy = event.y
        }
      })
      .on('end', (event, d) => {
        if (!event.active && simulation) simulation.alphaTarget(0)
        if (!d.isHub) {
          d.fx = null
          d.fy = null
        }
      })

    node.call(drag)

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as StarNode).x ?? 0)
        .attr('y1', d => (d.source as StarNode).y ?? 0)
        .attr('x2', d => (d.target as StarNode).x ?? 0)
        .attr('y2', d => (d.target as StarNode).y ?? 0)

      node.attr('transform', d => `translate(${d.x ?? 0},${d.y ?? 0})`)
    })

    // Add title
    svg
      ?.append('text')
      .attr('x', width / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .style('fill', 'rgb(229 231 235)')
      .style('font-size', '18px')
      .style('font-weight', '600')
      .text('Star Graph Visualization')
  }

  /**
   * Handles window resize to redraw star graph
   */
  const handleResize = (): void => {
    createStarGraph()
  }

  onMounted(() => {
    createStarGraph()

    // Set up resize observer
    if (starContainer.value) {
      resizeObserver = new globalThis.ResizeObserver(handleResize)
      resizeObserver.observe(starContainer.value)
    }
  })

  onUnmounted(() => {
    if (simulation) {
      simulation.stop()
    }
    if (resizeObserver) {
      resizeObserver.disconnect()
    }
  })

  watch(
    () => props.nodeCount,
    () => {
      createStarGraph()
    }
  )
</script>

<script lang="ts">
  export default {
    name: 'D3StarGraph'
  }
</script>
