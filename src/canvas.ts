import { pixel_ratio, block_size } from './editor/configuration'
import { modulo_ceiling } from './utils/math'
import { viewbox_pos } from './globals/viewbox'

// load the renderer div which wraps all the canvas
let maybe_renderer = document.getElementById('renderer') as HTMLDivElement | null
if (maybe_renderer === null) { throw new Error('Could not find the renderer div') }
export let renderer = maybe_renderer

// load all the canvas
let background_canvas = document.getElementById('background') as HTMLCanvasElement | null
let static_background_canvas = document.createElement('canvas') // this canvas is virtual
let connections_canvas = document.getElementById('connections') as HTMLCanvasElement | null

// check that the canvas are not null
if (background_canvas === null) { throw new Error('Could not find the background canvas') }
if (connections_canvas === null) { throw new Error('Could not find connections canvas') }

// load the canvas context
let maybe_background_ctx = background_canvas.getContext('2d')
let maybe_static_background_ctx = static_background_canvas.getContext('2d')
let maybe_connections_ctx = connections_canvas.getContext('2d')

// check that the canvas contexts are not null
if (maybe_background_ctx === null) { throw new Error('Could not get the background canvas context') }
if (maybe_static_background_ctx === null) { throw new Error('Could not get static background canvas context') }
if (maybe_connections_ctx === null) { throw new Error('Could not get connections canvas context') }

// export the canvas contexts
export let background_ctx = maybe_background_ctx
export let static_background_ctx = maybe_static_background_ctx
export let connections_ctx = maybe_connections_ctx

// save the starting size of the canvas
let previous_width = 0
let previous_height = 0

// make sure to resize the canvas when the window is resized
export function resize_canvas() {
  // resize the background canvas
  background_ctx.canvas.width = pixel_ratio * renderer.clientWidth
  background_ctx.canvas.height = pixel_ratio * renderer.clientHeight
  background_ctx.scale(pixel_ratio, pixel_ratio)

  // resize the static background canvas
  static_background_ctx.canvas.width = pixel_ratio * (modulo_ceiling(renderer.clientWidth, block_size) + block_size)
  static_background_ctx.canvas.height = pixel_ratio * (modulo_ceiling(renderer.clientHeight, block_size) + block_size)
  static_background_ctx.scale(pixel_ratio, pixel_ratio)

  // resize the connections canvas
  connections_ctx.canvas.width = pixel_ratio * renderer.clientWidth
  connections_ctx.canvas.height = pixel_ratio * renderer.clientHeight
  connections_ctx.scale(pixel_ratio, pixel_ratio)

  // update the viewbox to keep the center of the screen still in the center of the screen
  let delta_width = background_ctx.canvas.width / pixel_ratio - previous_width
  let delta_height = background_ctx.canvas.height / pixel_ratio - previous_height
  viewbox_pos.x -= delta_width / 2
  viewbox_pos.y -= delta_height / 2
  previous_width = background_ctx.canvas.width / pixel_ratio
  previous_height = background_ctx.canvas.height / pixel_ratio
}
