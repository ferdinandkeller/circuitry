import { background_ctx, static_background_ctx } from './canvas'
import { block_size, dot_size, cross_width, cross_size, pixel_ratio } from './config'
import { viewbox_pos } from './viewbox'
import { clear_canvas, } from './utils/rendering'
import { Vector } from './utils/vector'

export function render_static_background() {
    // compute the number of dots to draw
    // the static background canvas is a virtual canvas which size is a multiple of the block size
    // so there is no need to compute any kind of rounding
    // we render the static background once and then we draw it on the visible (real) background
    // with some offset to create the illusion of an infinite background
    let width_point_count = static_background_ctx.canvas.width / pixel_ratio / block_size + 1
    let height_point_count = static_background_ctx.canvas.height / pixel_ratio / block_size + 1

    // clear the static background
    clear_canvas(static_background_ctx)

    // set the dots color
    static_background_ctx.fillStyle = 'hsl(240, 7%, 85%)'

    // draw the dots
    for (let x = 0; x < width_point_count; x++) {
        for (let y = 0; y < height_point_count; y++) {
            static_background_ctx.beginPath()
            static_background_ctx.arc(x * block_size, y * block_size, dot_size/2, 0, 2 * Math.PI)
            static_background_ctx.fill()
        }
    }
}

export function render_background() {
    // compute negative modulo of the current position
    // negative because the static canvas drawing goes in the opposite direction of the viewbox
    // modulo because the static background is repeated and we use that to make it appear infinite
    let viewbox_pos_neg_modulo = viewbox_pos.neg().mod(block_size)

    // clear the background
    clear_canvas(background_ctx)

    // draw the static background on the visible background
    background_ctx.drawImage(
        // the image (actually the static background canvas)
        static_background_ctx.canvas,
        // where to draw the canvas (top and left corners)
        viewbox_pos_neg_modulo.x - block_size,
        viewbox_pos_neg_modulo.y - block_size, 
        // the size of the canvas
        static_background_ctx.canvas.width / pixel_ratio,
        static_background_ctx.canvas.height / pixel_ratio
    )

    // get the position of the cross in screen coordinates
    let cross_pos = Vector.zero().to_screen()

    // draw the center cross on the canvas
    background_ctx.strokeStyle = 'hsl(240, 7%, 20%)'
    background_ctx.lineWidth = cross_width
    background_ctx.lineCap = 'round'

    background_ctx.beginPath()
    background_ctx.moveTo(cross_pos.x - cross_size, cross_pos.y)
    background_ctx.lineTo(cross_pos.x + cross_size, cross_pos.y)
    background_ctx.stroke()

    background_ctx.beginPath()
    background_ctx.moveTo(cross_pos.x, cross_pos.y - cross_size)
    background_ctx.lineTo(cross_pos.x, cross_pos.y + cross_size)
    background_ctx.stroke()
}