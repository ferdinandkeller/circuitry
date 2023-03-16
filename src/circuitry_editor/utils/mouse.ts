import { Vector } from '@/utils/vector'
import { Child } from '@/utils/child'

export class Mouse extends Child {
    /**
     * Represents the mouse's position.
     * This position is relative to the screen.
     */
    screen_pos: Vector = Vector.zero()

    /**
     * Represents the mouse's position.
     * This position is relative to the screen.
     * This position is rounded to the nearest dot.
     */
    screen_pos_grid: Vector = Vector.zero()

    /**
     * Represents the mouse's position.
     * This position is relative to the world.
     */
    world_pos: Vector = Vector.zero()

    /**
     * Represents the mouse's position.
     * This position is relative to the world.
     * This position is rounded to the nearest dot.
     */
    world_pos_grid: Vector = Vector.zero()

    /**
     * Updates the mouse's position variables all at once.
     * 
     * @param mouse_screen_pos_x The mouse's current screen position x.
     * @param mouse_screen_pos_y The mouse's current screen position y.
     */
    update_mouse_pos(mouse_screen_pos_x: number, mouse_screen_pos_y: number) {
        // get the renderer div's position relative to the screen
        // this is needed to get the correct mouse screen position
        let renderer_div_rect = this.circuitry_editor.renderer_div.getBoundingClientRect()

        // set the mouse screen position to the provided values
        // you have to substract the position relative to the screen
        this.screen_pos = new Vector(
            mouse_screen_pos_x - renderer_div_rect.left,
            mouse_screen_pos_y - renderer_div_rect.top
        )

        // the mouse screen position is relative to the viewbox,
        // by adding the viewbox position relative to the world,
        // we can get the mouse position relative to the world
        this.world_pos = this.screen_pos.to_world(this.circuitry_editor.viewbox_pos)

        // to get the mouse world position rounded to the nearest dot,
        // we simply round the world position
        this.world_pos_grid = this.world_pos.modulo_rounding(this.circuitry_editor.configuration.grid_size)

        // to get the mouse screen position rounded to the nearest dot,
        // we can't simply round the screen position, because it would round to the nearest dot
        // base on the top left corner of the screen
        // so what we do is we convert the screen position to the world position, round it to the nearest dot,
        // and then convert it back to the screen position
        // we already did the first two steps, so we just need to convert it back to the screen position
        this.screen_pos_grid = this.world_pos_grid.to_screen(this.circuitry_editor.viewbox_pos)
    }
}
