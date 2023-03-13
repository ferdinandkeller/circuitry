// import styles
import './style.scss'

// import logic
import './editor/logic'
import { EditionMode, active_edition_mode } from './editor/logic'
import { resize_canvas, renderer } from './rendering/canvas'
import { render_background, render_static_background } from './rendering/background'
import { pan_start, pan_move, pan_end } from './modes/pan'
import { connect_start, connect_move, connect_end } from './modes/connect'
import { update_cursor_pos } from './globals/cursor'
import { render_components, detect_hover } from './rendering/components'

/**
* A full render is a render of the entire canvas.
* This is used when the window is resized or at startup.
* 
* It will resize all the canvas, regenerate the static background, and re-render the background.
*/
function full_render() {
    // resize the canvas to fit the window
    resize_canvas()
    // render the static background
    render_static_background()
    // trigger a background render
    render_background()
    // trigger a component render
    render_components()
}

// whenever the window is resized, re-render the background
window.addEventListener('resize', full_render)

// trigger the initial full render
full_render()

/**
 * Register mousedown event on the renderer.
 * This is because this element contains the canvas.
 * We want to trigger mousedown handlers only when the user is clicking on the canvas.
 */
renderer.addEventListener('mousedown', (mouse_event: MouseEvent) => {
    // update the cursor's position
    update_cursor_pos(mouse_event.clientX, mouse_event.clientY)
    
    if (detect_hover()) {
    } else {
        // update depending on the active edition mode
        if (active_edition_mode === EditionMode.PAN) pan_start()
        else if (active_edition_mode === EditionMode.CONNECT) connect_start()
    }
})

/**
 * Register mousemove event on the renderer.
 * We want to trigger mousemove handlers even if the user is not on the canvas anymore.
 */
window.addEventListener('mousemove', (mouse_event: MouseEvent) => {
    // update the cursor's position
    update_cursor_pos(mouse_event.clientX, mouse_event.clientY)

    // update depending on the active edition mode
    if (active_edition_mode === EditionMode.PAN) pan_move()
    else if (active_edition_mode === EditionMode.CONNECT) connect_move()
})

/**
 * Register mousemove event on the window.
 * We want to trigger mouseup handlers even if the user is not on the canvas anymore.
 */
window.addEventListener('mouseup', (mouse_event: MouseEvent) => {
    // update the cursor's position
    update_cursor_pos(mouse_event.clientX, mouse_event.clientY)
    
    // update depending on the active edition mode
    if (active_edition_mode === EditionMode.PAN) pan_end()
    else if (active_edition_mode === EditionMode.CONNECT) connect_end()
})
