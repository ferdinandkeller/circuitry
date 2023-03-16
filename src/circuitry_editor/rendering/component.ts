import { CircuitryEditor } from '@'
import { Vector } from '@/utils/vector'
import { Canvas } from './canvas'
import { render_rounded_rect as rounded_rect_path } from './shapes'

export class Component {
    circuitry_editor: CircuitryEditor

    position: Vector // position in world space
    name: string
    inputs: number = 2
    outputs: number = 1

    width: number
    height: number
    shadow_radius: number
    shadow_delta_x: number
    shadow_delta_y: number
    border_radius: number

    // the component is rendered on a cache canvas when it's created
    // this is done to avoid rendering the component multiple times
    // this cache is then rendered on the main canvas using some offset
    component_cache: Canvas
    shadow_cache: Canvas

    animation_frame: number = 0

    is_hovered_cache: boolean = false

    constructor(circuitry_editor: CircuitryEditor, name: string, position: Vector) {
        this.circuitry_editor = circuitry_editor

        this.component_cache = new Canvas(circuitry_editor)
        this.shadow_cache = new Canvas(circuitry_editor)

        this.name = name

        this.width = 6
        this.height = 2 * Math.max(this.inputs, this.outputs)
        this.shadow_radius = 1.5
        this.shadow_delta_x = 0
        this.shadow_delta_y = 1
        this.border_radius = this.circuitry_editor.configuration.grid_size / 5
        this.position = new Vector(
            position.x * this.circuitry_editor.configuration.grid_size,
            position.y * this.circuitry_editor.configuration.grid_size
        )

        this.component_cache.resize(
            this.circuitry_editor.configuration.grid_size * this.width + this.border_radius,
            this.circuitry_editor.configuration.grid_size * this.height + this.border_radius,
        )
        this.shadow_cache.resize(
            this.circuitry_editor.configuration.grid_size * (this.width + 2 * this.shadow_radius * 1.5),
            this.circuitry_editor.configuration.grid_size * (this.height + 2 * this.shadow_radius * 1.5),
        )

        this.render_component_cache()
        this.render_shadow_cache()
    }

    is_hovered(): boolean {
        this.is_hovered_cache =
            this.position.x <= this.circuitry_editor.mouse.world_pos.x &&
            this.circuitry_editor.mouse.world_pos.x <= this.position.x + this.circuitry_editor.configuration.grid_size * this.width &&
            this.position.y <= this.circuitry_editor.mouse.world_pos.y &&
            this.circuitry_editor.mouse.world_pos.y <= this.position.y + this.circuitry_editor.configuration.grid_size * this.height

        return this.is_hovered_cache
    }

    // cool_animation() {
    //     console.log("animation")

    //     this.animation_frame -= 1
    //     if (this.animation_frame <= 0) return
    //     requestAnimationFrame(this.cool_animation.bind(this))
    // }

    // hover_animation() {
    //     this.animation_frame = 60
    //     this.cool_animation()
    // }

    /**
     * Render the component using the cached canvas.
     */
    render_component_cache() {
        // compute the component's path
        rounded_rect_path(
            this.component_cache,
            new Vector(
                this.border_radius / 2,
                this.border_radius / 2
            ),
            this.circuitry_editor.configuration.grid_size * this.width,
            this.circuitry_editor.configuration.grid_size * this.height,
            this.circuitry_editor.configuration.grid_size / 2
        )

        // render the background
        this.component_cache.ctx.save()
        this.component_cache.ctx.fillStyle = 'hsl(240, 20%, 98%)'
        this.component_cache.ctx.shadowColor = 'hsla(240, 20%, 10%, .08)'
        this.component_cache.ctx.fill()
        this.component_cache.ctx.restore()

        // render the outline
        this.component_cache.ctx.save()
        this.component_cache.ctx.lineWidth = this.border_radius
        this.component_cache.ctx.strokeStyle = 'hsl(240, 20%, 92%)'
        this.component_cache.ctx.stroke()
        this.component_cache.ctx.restore()

        // render the inputs & outputs
        this.component_cache.ctx.save()

        this.component_cache.ctx.fillStyle = 'hsl(240, 20%, 92%)'
        let delta = this.circuitry_editor.configuration.grid_size * 2

        let y = this.circuitry_editor.configuration.grid_size * (Math.max(this.inputs, this.outputs) - this.inputs + 1)

        for (let i = 0; i < this.inputs; i++) {
            this.component_cache.ctx.beginPath()
            this.component_cache.ctx.arc(
                this.border_radius / 2,
                this.border_radius / 2 + y,
                this.border_radius * 2,
                -Math.PI / 2, Math.PI / 2
            )
            this.component_cache.ctx.fill()
            y += delta
        }

        y = this.circuitry_editor.configuration.grid_size * (Math.max(this.inputs, this.outputs) - this.outputs + 1)

        for (let i = 0; i < this.outputs; i++) {
            this.component_cache.ctx.beginPath()
            this.component_cache.ctx.arc(
                this.circuitry_editor.configuration.grid_size * this.width + this.border_radius / 2,
                this.border_radius / 2 + y,
                this.border_radius * 2,
                Math.PI / 2, -Math.PI / 2
            )
            this.component_cache.ctx.fill()
            y += delta
        }

        this.component_cache.ctx.restore()

        // render the name
        let height = 20
        this.component_cache.ctx.save()
        this.component_cache.ctx.font = '500 ' + height + 'px DM Mono'
        this.component_cache.ctx.fillStyle = 'hsl(0, 0%, 20%)'
        this.component_cache.ctx.textAlign = 'center'
        this.component_cache.ctx.fillText(
            this.name,
            this.circuitry_editor.configuration.grid_size * this.width / 2 + this.border_radius / 2,
            this.circuitry_editor.configuration.grid_size * this.height / 2 + this.border_radius / 2 + height * 2 / 3 / 2
        )
        this.component_cache.ctx.restore()

        // // test font

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

    render_shadow_cache() {
        // compute the component's path
        rounded_rect_path(
            this.shadow_cache,
            new Vector(
                this.circuitry_editor.configuration.grid_size * Math.max(0, this.shadow_radius * 1.5 - this.shadow_delta_x),
                this.circuitry_editor.configuration.grid_size * Math.max(0, this.shadow_radius * 1.5 - this.shadow_delta_y)
            ),
            this.circuitry_editor.configuration.grid_size * this.width,
            this.circuitry_editor.configuration.grid_size * this.height,
            this.circuitry_editor.configuration.grid_size / 2
        )

        // render the shadow
        this.shadow_cache.ctx.save()
        this.shadow_cache.ctx.shadowColor = 'hsla(240, 20%, 10%, .08)'
        this.shadow_cache.ctx.shadowBlur = this.shadow_radius * this.circuitry_editor.configuration.grid_size * this.circuitry_editor.configuration.pixel_ratio
        this.shadow_cache.ctx.shadowOffsetX = this.shadow_delta_x * this.circuitry_editor.configuration.grid_size * this.circuitry_editor.configuration.pixel_ratio
        this.shadow_cache.ctx.shadowOffsetY = this.shadow_delta_y * this.circuitry_editor.configuration.grid_size * this.circuitry_editor.configuration.pixel_ratio
        this.shadow_cache.ctx.fill()
        this.shadow_cache.ctx.restore()
    }

    render_shadow() {
        // convert the component's position into screen space
        let screen_position = this.position.to_screen(this.circuitry_editor.viewbox_pos)

        // render the component's shadow
        this.circuitry_editor.components_canvas.draw_image(
            this.shadow_cache,
            new Vector(
                screen_position.x - this.circuitry_editor.configuration.grid_size * Math.max(0, this.shadow_radius * 1.5 - this.shadow_delta_x),
                screen_position.y - this.circuitry_editor.configuration.grid_size * Math.max(0, this.shadow_radius * 1.5 - this.shadow_delta_y),
            )
        )
    }

    render_component() {
        // convert the component's position into screen space
        let screen_position = this.position.to_screen(this.circuitry_editor.viewbox_pos)

        // render the component
        this.circuitry_editor.components_canvas.draw_image(
            this.component_cache,
            new Vector(
                screen_position.x - this.border_radius / 2,
                screen_position.y - this.border_radius / 2,
            )
        )
    }
}
