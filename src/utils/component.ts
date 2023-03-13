import { dot_size } from '@/editor/configuration'
import { Vector } from './vector'
import { cursor_world_pos } from '@/globals/cursor'
import { render_rounded_rect, free_canvas } from '@/utils/rendering'
import { pixel_ratio } from '@/editor/configuration'

export class Component {
    position: Vector // position in world space
    width: number
    height: number

    // the component is rendered on a cache canvas when it's created
    // this is done to avoid rendering the component multiple times
    // this cache is then rendered on the main canvas using some offset
    #render_cache_margin: number
    #render_cache_canvas: HTMLCanvasElement
    #render_cache_ctx: CanvasRenderingContext2D

    constructor(position: Vector) {
        this.width = 6
        this.height = 4
        this.position = new Vector(position.x * dot_size, position.y * dot_size)

        this.#render_cache_margin = 30 + dot_size/2
        this.#render_cache_canvas = document.createElement('canvas')
        this.#render_cache_canvas.width = pixel_ratio * (dot_size * this.width + 2 * this.#render_cache_margin)
        this.#render_cache_canvas.height = pixel_ratio * (dot_size * this.height + 2 * this.#render_cache_margin)
        let maybe_ctx = this.#render_cache_canvas.getContext('2d')
        if (maybe_ctx === null) { throw new Error('Could not get context of render cache canvas') }
        this.#render_cache_ctx = maybe_ctx
        this.#render_cache_ctx.scale(pixel_ratio, pixel_ratio)
        this.render_cache()
        window.addEventListener('beforeunload', () => {
            free_canvas(this.#render_cache_canvas)
        })
    }

    is_hovered() {
        return  this.position.x <= cursor_world_pos.x &&
                cursor_world_pos.x <= this.position.x + dot_size * this.width &&
                this.position.y <= cursor_world_pos.y &&
                cursor_world_pos.y <= this.position.y + dot_size * this.height
    }

    /**
     * Render the component using the cached canvas.
     */
    render_cache() {
        // compute the component's path
        render_rounded_rect(
            this.#render_cache_ctx,
            new Vector(this.#render_cache_margin, this.#render_cache_margin),
            dot_size * this.width, dot_size * this.height,
            dot_size / 2
        )

        // render the background
        this.#render_cache_ctx.save()
        this.#render_cache_ctx.fillStyle = 'hsl(240, 20%, 98%)'
        this.#render_cache_ctx.shadowColor = 'hsla(240, 20%, 10%, .08)'
        this.#render_cache_ctx.shadowBlur = 30
        this.#render_cache_ctx.shadowOffsetY = dot_size / 2
        this.#render_cache_ctx.fill()
        this.#render_cache_ctx.restore()

        // render the outline
        this.#render_cache_ctx.save()
        this.#render_cache_ctx.lineWidth = dot_size / 10
        this.#render_cache_ctx.strokeStyle = 'hsl(240, 20%, 92%)'
        this.#render_cache_ctx.stroke()
        this.#render_cache_ctx.restore()
    }

    render(ctx: CanvasRenderingContext2D) {
        // convert the component's position into screen space
        let screen_position = this.position.to_screen()

        // render the cached component
        ctx.drawImage(
            this.#render_cache_canvas,
            screen_position.x - this.#render_cache_margin,
            screen_position.y - this.#render_cache_margin,
            dot_size * this.width + 2 * this.#render_cache_margin, dot_size * this.height + 2 * this.#render_cache_margin
        )

        // let height = 20
        // ctx.font = '500 ' + height + 'px DM_Mono'
        // ctx.fillStyle = 'hsl(0, 0%, 20%)'
        // ctx.textAlign = 'center'
        // ctx.fillText('AND', 10 * dot_size + dot_size * 6 / 2, 10 * dot_size + dot_size * 4 / 2 + (height * 0.65)/2)
        // ctx.restore()
    
        // // test font
        // let fontface = new FontFace('DM_Mono', 'url(https://fonts.gstatic.com/s/dmmono/v10/aFTR7PB1QTsUX8KYvumzEY2tbYf-Vlh3uA.woff2)')
        // fontface.load().then((font) => {
        //     document.fonts.add(font)
        // })

        // let animation_frame = 0
        // function animation_function() {
        //     add timing function to test how much time passes between each frame
        //     animation_frame += 1
        //     if (animation_frame < 10) {
        //         requestAnimationFrame(animation_function)
        //     }
        // }
        // requestAnimationFrame(animation_function)
    }
}
