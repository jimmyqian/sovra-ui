<template>
  <div ref="starContainer" class="w-full h-full bg-bg-primary"></div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import * as d3 from 'd3'

  interface StarNode {
    id: string
    label: string
    isHub: boolean
    dashboardId?: string
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

  const router = useRouter()
  const starContainer = ref<HTMLElement | null>(null)
  let svg: d3.Selection<SVGSVGElement, unknown, null, undefined> | null = null
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

    // Add P Whittaker node connected to node 4
    nodes.push({
      id: 'node-p-whittaker',
      label: 'P Whittaker',
      isHub: false,
      dashboardId: '7f3e8d9a-2c5b-4e1f-9a6d-3b8c5e2f7a4d'
    })

    return nodes
  }

  /**
   * Generates links connecting all non-hub nodes to the hub
   * Exception: P Whittaker only connects to node 4, not to the hub
   */
  const generateLinks = (nodes: StarNode[]): StarLink[] => {
    const hub = nodes.find(node => node.isHub)
    if (!hub) return []

    const links = nodes
      .filter(node => !node.isHub && node.id !== 'node-p-whittaker')
      .map(node => ({
        source: hub.id,
        target: node.id
      }))

    // Add link from P Whittaker to node 4 only
    const pWhittaker = nodes.find(node => node.id === 'node-p-whittaker')
    if (pWhittaker) {
      links.push({
        source: 'node-4',
        target: pWhittaker.id
      })
    }

    return links
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

    if (!svg) return

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
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(35).strength(0.5))

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

    // Add circles for nodes (except P Whittaker which uses image)
    node
      .filter((d: StarNode) => d.id !== 'node-p-whittaker')
      .append('circle')
      .attr('r', (d: StarNode) => (d.isHub ? 40 : 30))
      .attr('fill', (d: StarNode) => (d.isHub ? '#EF4444' : '#3B82F6'))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)

    // Add profile image for P Whittaker node with flashing red border
    const pWhittakerNode = node.filter(
      (d: StarNode) => d.id === 'node-p-whittaker'
    )

    // Create defs for pattern and animation
    const defs = svg?.append('defs')

    // Create radial gradient for red glow effect
    const redGlow = defs
      ?.append('radialGradient')
      .attr('id', 'red-glow')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%')

    redGlow?.append('stop').attr('offset', '0%').attr('stop-color', '#EF4444')
    redGlow?.append('stop').attr('offset', '100%').attr('stop-color', '#DC2626')

    // Add outer circle for red shadow/glow effect
    pWhittakerNode
      .append('circle')
      .attr('class', 'alert-glow')
      .attr('r', 38)
      .attr('fill', 'none')
      .attr('stroke', '#EF4444')
      .attr('stroke-width', 6)
      .style('filter', 'drop-shadow(0 0 10px #EF4444)')
      .style('opacity', 0.8)

    // Add clipPath for circular image
    defs
      ?.append('clipPath')
      .attr('id', 'circle-clip')
      .append('circle')
      .attr('r', 30)

    // Add image for P Whittaker (using object-cover approach like search result cards)
    pWhittakerNode
      .append('image')
      .attr('class', 'profile-image')
      .attr(
        'xlink:href',
        'https://raw.githubusercontent.com/imcnaney/donkey/main/img/vm2.jpg'
      )
      .attr('x', -30)
      .attr('y', -30)
      .attr('width', 60)
      .attr('height', 60)
      .attr('clip-path', 'url(#circle-clip)')
      .attr('preserveAspectRatio', 'xMidYMid slice')

    // Add flashing animation to alert glow (slowed to half speed)
    // Use named transition 'pulse' to avoid conflicts with hover size changes
    const animate = () => {
      d3.selectAll('.alert-glow')
        .transition('pulse')
        .duration(1600)
        .style('opacity', 0.3)
        .transition('pulse')
        .duration(1600)
        .style('opacity', 0.9)
        .on('end', animate)
    }
    animate()

    // Add labels (only for non-P Whittaker nodes, as P Whittaker shows name on hover)
    node
      .filter((d: StarNode) => d.id !== 'node-p-whittaker')
      .append('text')
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .style('fill', '#fff')
      .style('font-size', (d: StarNode) => (d.isHub ? '16px' : '14px'))
      .style('font-weight', '600')
      .style('pointer-events', 'none')
      .text((d: StarNode) => d.label)

    // Add click handler for nodes with dashboardId
    node.on('click', (_: unknown, d: StarNode) => {
      if (d.dashboardId) {
        router.push(`/dashboard/${d.dashboardId}`)
      }
    })

    // Add tooltip group for chat bubble
    const tooltip = g
      .append('g')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('pointer-events', 'none')

    // Create chat bubble background
    const bubbleRect = tooltip
      .append('rect')
      .attr('rx', 8)
      .attr('ry', 8)
      .attr('fill', '#1F2937')
      .attr('stroke', '#3B82F6')
      .attr('stroke-width', 2)
      .style('filter', 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))')

    // Create chat bubble tail (triangle)
    const bubbleTail = tooltip
      .append('path')
      .attr('fill', '#1F2937')
      .attr('stroke', '#3B82F6')
      .attr('stroke-width', 2)
      .attr('stroke-linejoin', 'round')

    // Create text element for bubble
    const bubbleText = tooltip
      .append('text')
      .attr('text-anchor', 'middle')
      .style('fill', '#fff')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .style('pointer-events', 'none')

    // Add hover effects
    node.on('mouseenter', function (_: unknown, d: StarNode) {
      // Only apply circle hover effects to non-P Whittaker nodes
      if (d.id !== 'node-p-whittaker') {
        d3.select(this as SVGGElement)
          .select('circle')
          .transition()
          .duration(200)
          .attr('r', d.isHub ? 50 : 40)
          .attr('fill', d.isHub ? '#DC2626' : '#2563EB')
      } else {
        // For P Whittaker, enhance the image on hover
        d3.select(this as SVGGElement)
          .select('.profile-image')
          .transition()
          .duration(200)
          .attr('x', -35)
          .attr('y', -35)
          .attr('width', 70)
          .attr('height', 70)

        // Intensify the alert glow on hover (without interrupting opacity animation)
        const glowElement = d3.select(this as SVGGElement).select('.alert-glow')
        glowElement
          .transition('size')
          .duration(200)
          .attr('r', 43)
          .attr('stroke-width', 8)
      }

      // Show tooltip for P Whittaker node
      if (d.id === 'node-p-whittaker') {
        const name = 'Preston Cole Whittaker III'
        bubbleText.text(name)

        // Get text dimensions for sizing the bubble
        const textNode = bubbleText.node()
        const bbox = textNode ? textNode.getBBox() : { width: 100, height: 20 }
        const padding = 12
        const bubbleWidth = bbox.width + padding * 2
        const bubbleHeight = bbox.height + padding * 2
        const tailSize = 8

        // Position and size the bubble
        const bubbleX = (d.x ?? 0) - bubbleWidth / 2
        const bubbleY = (d.y ?? 0) - 60 - bubbleHeight

        bubbleRect
          .attr('x', bubbleX)
          .attr('y', bubbleY)
          .attr('width', bubbleWidth)
          .attr('height', bubbleHeight)

        // Position text in center of bubble
        bubbleText
          .attr('x', d.x ?? 0)
          .attr('y', bubbleY + bubbleHeight / 2 + bbox.height / 3)

        // Create tail pointing down to the node
        const tailPath = `
          M ${(d.x ?? 0) - tailSize},${bubbleY + bubbleHeight}
          L ${d.x ?? 0},${bubbleY + bubbleHeight + tailSize}
          L ${(d.x ?? 0) + tailSize},${bubbleY + bubbleHeight}
          Z
        `
        bubbleTail.attr('d', tailPath)

        // Show tooltip with fade-in animation
        tooltip.transition().duration(200).style('opacity', 1)
      }
    })

    node.on('mouseleave', function (_: unknown, d: StarNode) {
      // Only apply circle hover effects to non-P Whittaker nodes
      if (d.id !== 'node-p-whittaker') {
        d3.select(this as SVGGElement)
          .select('circle')
          .transition()
          .duration(200)
          .attr('r', d.isHub ? 40 : 30)
          .attr('fill', d.isHub ? '#EF4444' : '#3B82F6')
      } else {
        // For P Whittaker, reset the image size
        d3.select(this as SVGGElement)
          .select('.profile-image')
          .transition()
          .duration(200)
          .attr('x', -30)
          .attr('y', -30)
          .attr('width', 60)
          .attr('height', 60)

        // Reset the alert glow (without interrupting opacity animation)
        const glowElement = d3.select(this as SVGGElement).select('.alert-glow')
        glowElement
          .transition('size')
          .duration(200)
          .attr('r', 38)
          .attr('stroke-width', 6)
      }

      // Hide tooltip
      if (d.id === 'node-p-whittaker') {
        tooltip.transition().duration(200).style('opacity', 0)
      }
    })

    // Add drag behavior (only for non-hub nodes)
    const drag = d3
      .drag<SVGGElement, StarNode>()
      .on(
        'start',
        (
          event: d3.D3DragEvent<SVGGElement, StarNode, StarNode>,
          d: StarNode
        ) => {
          if (!event.active && simulation) simulation.alphaTarget(0.3).restart()
          d.fx = d.x
          d.fy = d.y
        }
      )
      .on(
        'drag',
        (
          event: d3.D3DragEvent<SVGGElement, StarNode, StarNode>,
          d: StarNode
        ) => {
          if (!d.isHub) {
            d.fx = event.x
            d.fy = event.y
          }
        }
      )
      .on(
        'end',
        (
          event: d3.D3DragEvent<SVGGElement, StarNode, StarNode>,
          d: StarNode
        ) => {
          if (!event.active && simulation) simulation.alphaTarget(0)
          if (!d.isHub) {
            d.fx = undefined
            d.fy = undefined
          }
        }
      )

    node.call(drag)

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: StarLink) => (d.source as StarNode).x ?? 0)
        .attr('y1', (d: StarLink) => (d.source as StarNode).y ?? 0)
        .attr('x2', (d: StarLink) => (d.target as StarNode).x ?? 0)
        .attr('y2', (d: StarLink) => (d.target as StarNode).y ?? 0)

      node.attr(
        'transform',
        (d: StarNode) => `translate(${d.x ?? 0},${d.y ?? 0})`
      )
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
