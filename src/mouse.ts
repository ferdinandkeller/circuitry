import { Vector } from './utils/vector'
import { block_size } from './config'

// define a variable to store the mouse's position
// this position is relative to the screen
export let mouse_screen_pos = Vector.zero()

// define a variable to store the mouse's position
// this position is relative to the screen
// this position is rounded to the nearest block
export let mouse_screen_pos_block = Vector.zero()

// define a variable to store the mouse's position
// this position is relative to the world
export let mouse_world_pos = Vector.zero()

// define a variable to store the mouse's position
// this position is relative to the world
// this position is rounded to the nearest block
export let mouse_world_pos_block = Vector.zero()

// define a method to update the mouse position variables
// it takes a mouse event as an argument
export function update_mouse_pos(mouse_event: MouseEvent) {
    // set the mouse screen position to the mouse event's position
    mouse_screen_pos = new Vector(mouse_event.clientX, mouse_event.clientY)

    // the mouse screen position is relative to the viewbox,
    // by adding the viewbox position relative to the world,
    // we can get the mouse position relative to the world
    mouse_world_pos = mouse_screen_pos.to_world()

    // to get the mouse world position rounded to the nearest block,
    // we simply round the world position
    mouse_world_pos_block = mouse_world_pos.modulo_rounding(block_size)
    
    // to get the mouse screen position rounded to the nearest block,
    // we can't simply round the screen position, because it would round to the nearest block
    // base on the top left corner of the screen
    // so what we do is we convert the screen position to the world position, round it to the nearest block,
    // and then convert it back to the screen position
    mouse_screen_pos_block = mouse_world_pos_block.to_screen()
}
