import { viewbox_pos } from '@/globals/viewbox'
import { render_background } from '@/background'
import { renderer } from '@/canvas'
import { Vector } from '@/utils/vector'
import { mouse_world_pos } from '@/globals/mouse'


// set viewbox panning state variables
let is_panning = false
let pan_start_mouse_pos = Vector.zero()
let pan_start_viewbox_pos = Vector.zero()

// mode switch handlers
export function enter_pan_mode() {
    // add the mode class to the renderer
    renderer.classList.add('pan-mode')
}

export function exit_pan_mode() {
    // leave the panning mode
    if (is_panning) {
        is_panning = false
    }

    // remove the mode class from the renderer
    renderer.classList.remove('pan-mode')
}

// mouse movements handlers
export function pan_start() {
    if (is_panning) return
    is_panning = true

    pan_start_mouse_pos.set(mouse_world_pos)
    pan_start_viewbox_pos.set(viewbox_pos)
}

export function pan_move() {
    if (!is_panning) return

    let delta_pos = mouse_world_pos.sub(pan_start_mouse_pos)
    let pan_end_viewbox_pos = viewbox_pos.sub(delta_pos)
    viewbox_pos.set(pan_end_viewbox_pos)

    render_background()
}

export function pan_end() {
    if (!is_panning) return
    is_panning = false
}
