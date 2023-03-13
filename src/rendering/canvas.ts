import { pixel_ratio, dot_size } from '@/editor/configuration'
import { modulo_ceiling } from '@/utils/math'
import { free_canvas } from '@/utils/rendering'
import { viewbox_pos } from '@/globals/viewbox'

// load the renderer div which wraps all the canvas
let maybe_renderer = document.getElementById('renderer') as HTMLDivElement | null
if (maybe_renderer === null) { throw new Error('Could not find the renderer div') }
export let renderer = maybe_renderer

// load all the canvas
let background_canvas = document.getElementById('background') as HTMLCanvasElement | null
let static_background_canvas = document.createElement('canvas') // this canvas is virtual
let connections_canvas = document.getElementById('connections') as HTMLCanvasElement | null
let active_connection_canvas = document.getElementById('active-connection') as HTMLCanvasElement | null
let components_canvas = document.getElementById('components') as HTMLCanvasElement | null

// check that the canvas are not null
if (background_canvas === null) { throw new Error('Could not find the background canvas') }
if (connections_canvas === null) { throw new Error('Could not find connections canvas') }
if (active_connection_canvas === null) { throw new Error('Could not find active-connection canvas') }
if (components_canvas === null) { throw new Error('Could not find components canvas') }

// load the canvas context
let maybe_background_ctx = background_canvas.getContext('2d')
let maybe_static_background_ctx = static_background_canvas.getContext('2d')
let maybe_connections_ctx = connections_canvas.getContext('2d')
let maybe_active_connection_ctx = active_connection_canvas.getContext('2d')
let maybe_components_ctx = components_canvas.getContext('2d')

// check that the canvas contexts are not null
if (maybe_background_ctx === null) { throw new Error('Could not get the background canvas context') }
if (maybe_static_background_ctx === null) { throw new Error('Could not get static background canvas context') }
if (maybe_connections_ctx === null) { throw new Error('Could not get connections canvas context') }
if (maybe_active_connection_ctx === null) { throw new Error('Could not get active-connection canvas context') }
if (maybe_components_ctx === null) { throw new Error('Could not get components canvas context') }

// export the canvas contexts
export let background_ctx = maybe_background_ctx
export let static_background_ctx = maybe_static_background_ctx
export let connections_ctx = maybe_connections_ctx
export let active_connection_ctx = maybe_active_connection_ctx
export let components_ctx = maybe_components_ctx

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
    static_background_ctx.canvas.width = pixel_ratio * (modulo_ceiling(renderer.clientWidth, dot_size) + dot_size)
    static_background_ctx.canvas.height = pixel_ratio * (modulo_ceiling(renderer.clientHeight, dot_size) + dot_size)
    static_background_ctx.scale(pixel_ratio, pixel_ratio)
    
    // resize the active-connection canvas
    active_connection_ctx.canvas.width = pixel_ratio * renderer.clientWidth
    active_connection_ctx.canvas.height = pixel_ratio * renderer.clientHeight
    active_connection_ctx.scale(pixel_ratio, pixel_ratio)
    
    // resize the connections canvas
    connections_ctx.canvas.width = pixel_ratio * renderer.clientWidth
    connections_ctx.canvas.height = pixel_ratio * renderer.clientHeight
    connections_ctx.scale(pixel_ratio, pixel_ratio)
    
    // resize the components canvas
    components_ctx.canvas.width = pixel_ratio * renderer.clientWidth
    components_ctx.canvas.height = pixel_ratio * renderer.clientHeight
    components_ctx.scale(pixel_ratio, pixel_ratio)
    
    // update the viewbox to keep the center of the screen still in the center of the screen
    let delta_width = renderer.clientWidth - previous_width
    let delta_height = renderer.clientHeight - previous_height
    viewbox_pos.x -= delta_width / 2
    viewbox_pos.y -= delta_height / 2
    previous_width = renderer.clientWidth
    previous_height = renderer.clientHeight
}

// canvas in safari are quite buggy
// when the window is reloaded, the canvas are deleted but the memory is not freed correctly
// this is a workaround to free the memory, where before the window is unloaded,
// the canvas are resized to be 0x0, which frees the memory
window.addEventListener('beforeunload', () => {
    free_canvas(background_canvas)
    free_canvas(static_background_canvas)
    free_canvas(connections_canvas)
    free_canvas(active_connection_canvas)
    free_canvas(components_canvas)
})
