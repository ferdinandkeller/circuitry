import { viewbox_pos } from './viewbox'
import { render_background } from './background'
import { renderer } from './canvas'
import { Vector } from './utils'
import { mouse_world_pos } from './mouse'


// set viewbox dragging state variables
let is_dragging = false
let drag_start_mouse_pos = Vector.zero()
let drag_start_viewbox_pos = Vector.zero()

// mode switch handlers
export function enter_drag_mode() {
    // add the mode class to the renderer
    renderer.classList.add('drag-mode')
}

export function exit_drag_mode() {
    // leave the dragging mode
    if (is_dragging) {
        is_dragging = false
    }

    // remove the mode class from the renderer
    renderer.classList.remove('drag-mode')
}

// mouse movements handlers
export function drag_start() {
    if (is_dragging) return
    is_dragging = true

    drag_start_mouse_pos.set(mouse_world_pos)
    drag_start_viewbox_pos.set(viewbox_pos)
}

export function drag_move() {
    if (!is_dragging) return

    let delta_pos = mouse_world_pos.sub(drag_start_mouse_pos)
    let drag_end_viewbox_pos = viewbox_pos.sub(delta_pos)
    viewbox_pos.set(drag_end_viewbox_pos)

    render_background()
}

export function drag_end() {
    if (!is_dragging) return
    is_dragging = false
}
