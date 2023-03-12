import { Vector } from '@/utils/vector'
import { block_size } from '@/editor/configuration'

/**
 * Represents the cursor's position.
 * This position is relative to the screen.
 */
export let cursor_screen_pos = Vector.zero()

/**
 * Represents the cursor's position.
 * This position is relative to the screen.
 * This position is rounded to the nearest dot.
 */
export let cursor_screen_pos_dot = Vector.zero()

/**
 * Represents the cursor's position.
 * This position is relative to the world.
 */
export let cursor_world_pos = Vector.zero()

/**
 * Represents the cursor's position.
 * This position is relative to the world.
 * This position is rounded to the nearest dot.
 */
export let cursor_world_pos_dot = Vector.zero()

/**
 * Updates the cursor's position variables all at once.
 * 
 * @param cursor_screen_pos_x The cursor's current screen position x.
 * @param cursor_screen_pos_y The cursor's current screen position y.
 */
export function update_cursor_pos(cursor_screen_pos_x: number, cursor_screen_pos_y: number) {
    // set the mouse screen position to the provided values
    cursor_screen_pos = new Vector(cursor_screen_pos_x, cursor_screen_pos_y)

    // the mouse screen position is relative to the viewbox,
    // by adding the viewbox position relative to the world,
    // we can get the mouse position relative to the world
    cursor_world_pos = cursor_screen_pos.to_world()

    // to get the mouse world position rounded to the nearest block,
    // we simply round the world position
    cursor_world_pos_dot = cursor_world_pos.modulo_rounding(block_size)
    
    // to get the mouse screen position rounded to the nearest block,
    // we can't simply round the screen position, because it would round to the nearest block
    // base on the top left corner of the screen
    // so what we do is we convert the screen position to the world position, round it to the nearest block,
    // and then convert it back to the screen position
    // we already did the first two steps, so we just need to convert it back to the screen position
    cursor_screen_pos_dot = cursor_world_pos_dot.to_screen()
}
