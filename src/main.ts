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
  // render the static background on the visible canvas
  render_background()
}

// whenever the window is resized, re-render the background
window.addEventListener('resize', full_render)

// trigger the initial full render
full_render()

/**
 * Register mouse events on the renderer.
 * This is because this element contains the canvas and it might not be the same size as the window.
 */
renderer.addEventListener('mousedown', (mouse_event: MouseEvent) => {
  // update the mouse's position
  update_cursor_pos(mouse_event.clientX, mouse_event.clientY)
  
  // update depending on the active edition mode
  if (active_edition_mode === EditionMode.PAN) pan_start()
  else if (active_edition_mode === EditionMode.CONNECT) connect_start()
})

renderer.addEventListener('mousemove', (mouse_event: MouseEvent) => {
  // update the mouse's position
  update_cursor_pos(mouse_event.clientX, mouse_event.clientY)
  
  // update depending on the active edition mode
  if (active_edition_mode === EditionMode.PAN) pan_move()
  else if (active_edition_mode === EditionMode.CONNECT) connect_move()
})

renderer.addEventListener('mouseup', (mouse_event: MouseEvent) => {
  // update the mouse's position
  update_cursor_pos(mouse_event.clientX, mouse_event.clientY)
  
  // update depending on the active edition mode
  if (active_edition_mode === EditionMode.PAN) pan_end()
  else if (active_edition_mode === EditionMode.CONNECT) connect_end()
})
