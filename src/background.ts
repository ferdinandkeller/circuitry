import { background_ctx, static_background_ctx } from './canvas'
import { block_size, dot_size, center_line_width, center_line_size, pixel_ratio } from './config'
import { viewbox_x, viewbox_y } from './viewbox'
import { mod } from './utils'

export function render_static_background() {
    // set the dots color
    static_background_ctx.fillStyle = 'hsl(240, 7%, 80%)'

    // compute the number of dots to draw
    let width_point_count = Math.ceil(static_background_ctx.canvas.width / block_size)
    let height_point_count = Math.ceil(static_background_ctx.canvas.height / block_size)

    // draw the dots
    for (let x = 0; x < width_point_count; x++) {
        for (let y = 0; y < height_point_count; y++) {
            static_background_ctx.beginPath()
            static_background_ctx.arc(x * block_size, y * block_size, dot_size/2, 0, 2 * Math.PI)
            static_background_ctx.fill()
        }
    }
}

export function render_background(render_viewbox_x: number = viewbox_x, render_viewbox_y: number = viewbox_y) {
    // compute modulo of the current position
    let mod_x = mod(-render_viewbox_x, block_size)
    let mod_y = mod(-render_viewbox_y, block_size)

    // clear the background
    background_ctx.clearRect(0, 0, background_ctx.canvas.width, background_ctx.canvas.height)

    // draw the background on the visible canvas
    background_ctx.drawImage(
        // the image (actually the static background canvas)
        static_background_ctx.canvas,
        // where to draw the canvas (top and left corners)
        mod_x - block_size,
        mod_y - block_size, 
        // the size of the canvas
        static_background_ctx.canvas.width / pixel_ratio,
        static_background_ctx.canvas.height / pixel_ratio
    )

    // draw the center point on the canvas
    background_ctx.fillStyle = 'hsl(240, 7%, 20%)'
    background_ctx.lineWidth = center_line_width
    background_ctx.lineCap = 'round'

    background_ctx.beginPath()
    background_ctx.moveTo(-render_viewbox_x - center_line_size, -render_viewbox_y)
    background_ctx.lineTo(-render_viewbox_x + center_line_size, -render_viewbox_y)
    background_ctx.stroke()

    background_ctx.beginPath()
    background_ctx.moveTo(-render_viewbox_x, -render_viewbox_y - center_line_size)
    background_ctx.lineTo(-render_viewbox_x, -render_viewbox_y + center_line_size)
    background_ctx.stroke()
}