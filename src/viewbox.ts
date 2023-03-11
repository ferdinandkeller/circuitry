import { render_background } from './background'

// export let current_x = window.innerWidth / 2
// export let current_y = window.innerHeight / 2
export let viewbox_x = 0
export let viewbox_y = 0

export function set_viewbox_x(x: number) {
    viewbox_x = x
}
export function set_viewbox_y(y: number) {
    viewbox_y = y
}

let is_dragging = false
let drag_start_x = 0
let drag_start_y = 0

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

    let new_x = viewbox_x - delta_x
    let new_y = viewbox_y - delta_y

    render_background(new_x, new_y)
}

export function drag_end(e: MouseEvent) {
    if (!is_dragging) return
    is_dragging = false

    let delta_x = e.clientX - drag_start_x
    let delta_y = e.clientY - drag_start_y

    let new_x = viewbox_x - delta_x
    let new_y = viewbox_y - delta_y

    render_background(new_x, new_y)

    viewbox_x = new_x
    viewbox_y = new_y
}
