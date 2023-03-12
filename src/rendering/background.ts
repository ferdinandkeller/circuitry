import { background_ctx, static_background_ctx } from './canvas'
import { dot_size, pixel_ratio } from '@/editor/configuration'
import { viewbox_pos } from '@/globals/viewbox'
import { clear_canvas, render_background_dot, render_cross } from '@/utils/rendering'
import { Vector } from '@/utils/vector'

/**
 * Renders the static background.
 * 
 * We render the static background on a virtual canvas once at startup and when resizing the window.
 * This rendering is then copied onto the visible (real) background when the user pans the viewbox.
 * This static background is copied with some offset to create the illusion of movement.
 * It is also copied using the modulo operator to create the illusion of an infinite background.
 * (we use this trick because we can't store an infinite background in RAM)
 */
export function render_static_background() {
    // compute the number of dots to draw
    // 
    // the static background canvas is a virtual canvas which size is a multiple of the dot_size,
    // so there is no need to compute any kind of rounding
    // we add one because all the dots are offset by half a dot_size, the first line is composed only
    // of half rendered elements, so we need to add one to make sure we render on the entire canvas
    // 
    // illustration :
    //     if the dots where not offset : |[][][]| <- 3 dots to render
    //     because the dots are offset :  |][][][| <- 4 dots to render (2 full + 2 half) = 3 + 1
    let width_point_count = static_background_ctx.canvas.width / pixel_ratio / dot_size + 1
    let height_point_count = static_background_ctx.canvas.height / pixel_ratio / dot_size + 1

    // clear the static background
    clear_canvas(static_background_ctx)

    // set the dots color
    static_background_ctx.fillStyle = 'hsl(240, 7%, 85%)'

    // draw the dots
    for (let x = 0; x < width_point_count; x++) {
        for (let y = 0; y < height_point_count; y++) {
            render_background_dot(static_background_ctx, new Vector(x * dot_size, y * dot_size))
        }
    }
}

/**
 * Renders the background.
 */
export function render_background() {
    // compute negative modulo of the current position
    // negative because the static canvas drawing goes in the opposite direction of the viewbox
    // modulo because the static background is repeating and we use that to make it appear infinite
    let viewbox_pos_neg_modulo = viewbox_pos.neg().mod(dot_size)

    // clear the background
    clear_canvas(background_ctx)

    // draw the static background on the visible background
    background_ctx.drawImage(
        // the image (actually the static background canvas)
        static_background_ctx.canvas,
        // where to draw the canvas (top and left corners)
        viewbox_pos_neg_modulo.x - dot_size,
        viewbox_pos_neg_modulo.y - dot_size, 
        // the size of the canvas
        static_background_ctx.canvas.width / pixel_ratio,
        static_background_ctx.canvas.height / pixel_ratio
    )

    // get the position of the cross in screen coordinates
    // the cross is at (0, 0) in world coordinate
    let cross_pos = Vector.zero().to_screen()
    
    // draw the center cross on the canvas
    background_ctx.strokeStyle = 'hsl(240, 7%, 85%)'
    render_cross(background_ctx, cross_pos)
}
