// import styles
import './style.scss'

// import ui logic
import './editor/logic'
import { EditionMode, active_edition_mode } from './editor/logic'
import { resize_canvas, renderer } from './rendering/canvas'
import { render_background, render_static_background } from './rendering/background'
import { pan_start, pan_move, pan_end } from './modes/pan'
import { connect_start, connect_move, connect_end } from './modes/connect'
import { update_cursor_pos } from './globals/cursor'

// define a full render function
function full_render() {
  // resize the canvas to fit the window
  resize_canvas()
  // render the cache background
  render_static_background()
  // render the cache background on the visible canvas
  render_background()
}

// whenever the window is resized, re-render the background
window.addEventListener('resize', full_render)

// trigger an initial full render
full_render()

// register mouse events on the renderer
// this is because this element contains the canvas
// and it might not be the same size as the window
renderer.addEventListener('mousedown', (mouse_event: MouseEvent) => {
  // update the mouse's position
  update_cursor_pos(mouse_event.clientX, mouse_event.clientY)
  
  // update depending on the active edition mode
  switch (active_edition_mode) {
    case EditionMode.PAN:
      pan_start()
      break
    case EditionMode.CONNECT:
      connect_start()
      break
  }
})

renderer.addEventListener('mousemove', (mouse_event: MouseEvent) => {
  // update the mouse's position
  update_cursor_pos(mouse_event.clientX, mouse_event.clientY)
  
  // update depending on the active edition mode
  switch (active_edition_mode) {
    case EditionMode.PAN:
      pan_move()
      break
    case EditionMode.CONNECT:
      connect_move()
      break
  }
})

renderer.addEventListener('mouseup', (mouse_event: MouseEvent) => {
  // update the mouse's position
  update_cursor_pos(mouse_event.clientX, mouse_event.clientY)
  
  // update depending on the active edition mode
  switch (active_edition_mode) {
    case EditionMode.PAN:
      pan_end()
      break
    case EditionMode.CONNECT:
      connect_end()
      break
  }
})
