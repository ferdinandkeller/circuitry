import { Child } from '@/utils/child'
import { Vector } from '@/utils/vector'

export class Background extends Child {
    /**
     * Renders the static background.
     * 
     * We render the static background on a virtual canvas once at startup and when resizing the window.
     * This rendering is then copied onto the visible (real) background when the user pans the viewbox.
     * This static background is copied with some offset to create the illusion of movement.
     * It is also copied using the modulo operator to create the illusion of an infinite background.
     * (we use this trick because we can't store an infinite background in RAM)
     */
    render_static_background() {
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
        let width_point_count = this.circuitry_editor.renderer_size.x / this.circuitry_editor.configuration.grid_size + 1
        let height_point_count = this.circuitry_editor.renderer_size.y / this.circuitry_editor.configuration.grid_size + 1

        // clear the static background
        this.circuitry_editor.static_background_canvas.clear()

        // save the current context
        this.circuitry_editor.static_background_canvas.ctx.save()

        // set the dots color
        this.circuitry_editor.static_background_canvas.ctx.fillStyle = 'hsl(240, 7%, 85%)'

        // draw the dots
        for (let x = 0; x < width_point_count; x++) {
            for (let y = 0; y < height_point_count; y++) {
                this.circuitry_editor.static_background_canvas.ctx.beginPath()
                this.circuitry_editor.static_background_canvas.ctx.arc(
                    x * this.circuitry_editor.configuration.grid_size,
                    y * this.circuitry_editor.configuration.grid_size,
                    this.circuitry_editor.configuration.dot_radius,
                    0, 2 * Math.PI
                )
                this.circuitry_editor.static_background_canvas.ctx.fill()
            }
        }

        // restore the context
        this.circuitry_editor.static_background_canvas.ctx.restore()
    }

    /**
     * Renders the background.
     */
    render_background() {
        // compute negative modulo of the current position
        // negative because the static canvas drawing goes in the opposite direction of the viewbox
        // modulo because the static background is repeating and we use that to make it appear infinite
        let viewbox_pos_neg_modulo = this.circuitry_editor.viewbox_pos.neg().mod(this.circuitry_editor.configuration.grid_size)

        // clear the background
        this.circuitry_editor.background_canvas.clear()

        // draw the static background on the visible background
        this.circuitry_editor.background_canvas.draw_image(
            this.circuitry_editor.static_background_canvas,
            new Vector(
                viewbox_pos_neg_modulo.x - this.circuitry_editor.configuration.grid_size,
                viewbox_pos_neg_modulo.y - this.circuitry_editor.configuration.grid_size
            )
        )

        // get the position of the cross in screen coordinates
        // the cross is at (0, 0) in world coordinate
        let cross_pos = Vector.zero().to_screen(this.circuitry_editor.viewbox_pos)

        // save the current context
        this.circuitry_editor.background_canvas.ctx.save()

        // draw the center cross on the canvas
        this.circuitry_editor.background_canvas.ctx.strokeStyle = 'hsl(240, 7%, 85%)'

        // set the cross parameters
        this.circuitry_editor.background_canvas.ctx.lineWidth = this.circuitry_editor.configuration.cross_width
        this.circuitry_editor.background_canvas.ctx.lineCap = 'round'

        // render the first line
        this.circuitry_editor.background_canvas.ctx.beginPath()
        this.circuitry_editor.background_canvas.ctx.moveTo(cross_pos.x - this.circuitry_editor.configuration.cross_length, cross_pos.y)
        this.circuitry_editor.background_canvas.ctx.lineTo(cross_pos.x + this.circuitry_editor.configuration.cross_length, cross_pos.y)
        this.circuitry_editor.background_canvas.ctx.stroke()

        // render the second line
        this.circuitry_editor.background_canvas.ctx.beginPath()
        this.circuitry_editor.background_canvas.ctx.moveTo(cross_pos.x, cross_pos.y - this.circuitry_editor.configuration.cross_length)
        this.circuitry_editor.background_canvas.ctx.lineTo(cross_pos.x, cross_pos.y + this.circuitry_editor.configuration.cross_length)
        this.circuitry_editor.background_canvas.ctx.stroke()

        // restore the context
        this.circuitry_editor.background_canvas.ctx.restore()
    }
}
