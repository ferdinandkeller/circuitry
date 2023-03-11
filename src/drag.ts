import { viewbox_x, viewbox_y, set_viewbox_x, set_viewbox_y } from './viewbox'
import { render_background } from './background'
import { renderer } from './canvas'


// set viewbox dragging state variables
let is_dragging = false
let drag_start_x = 0
let drag_start_y = 0
let drag_end_x = 0
let drag_end_y = 0

export function enter_drag_mode() {
    // add the mode class to the renderer
    renderer.classList.add('drag-mode')
}

export function exit_drag_mode() {
    // leave the dragging mode
    if (is_dragging) {
        is_dragging = false
        set_viewbox_x(drag_end_x)
        set_viewbox_y(drag_end_y)
    }

    // remove the mode class from the renderer
    renderer.classList.remove('drag-mode')
}

// handle dragging mouse events
export function drag_start(e: MouseEvent) {
    if (is_dragging) return
    is_dragging = true

    drag_start_x = e.clientX
    drag_start_y = e.clientY
}

export function drag_move(e: MouseEvent) {
    if (!is_dragging) return

    let delta_x = e.clientX - drag_start_x
    let delta_y = e.clientY - drag_start_y

    drag_end_x = viewbox_x - delta_x
    drag_end_y = viewbox_y - delta_y

    render_background(drag_end_x, drag_end_y)
}

export function drag_end(_: MouseEvent) {
    if (!is_dragging) return
    is_dragging = false

    set_viewbox_x(drag_end_x)
    set_viewbox_y(drag_end_y)
}
