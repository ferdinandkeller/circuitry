// import styles
import './style.scss'

// import ui logic
import { EditionMode, edition_mode } from './editor_logic'
import { resize_canvas, renderer } from './canvas'
import { render_background, render_static_background } from './background'
import { pan_start, pan_move, pan_end } from './pan'
import { connect_start, connect_move, connect_end } from './connect'
import { update_mouse_pos } from './mouse'

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
  update_mouse_pos(mouse_event)
  
  // update depending on the active edition mode
  switch (edition_mode) {
    case EditionMode.Pan:
      pan_start()
      break
    case EditionMode.Connect:
      connect_start()
      break
  }
})

renderer.addEventListener('mousemove', (event: MouseEvent) => {
  // update the mouse's position
  update_mouse_pos(event)
  
  // update depending on the active edition mode
  switch (edition_mode) {
    case EditionMode.Pan:
      pan_move()
      break
    case EditionMode.Connect:
      connect_move()
      break
  }
})

renderer.addEventListener('mouseup', (event: MouseEvent) => {
  // update the mouse's position
  update_mouse_pos(event)
  
  // update depending on the active edition mode
  switch (edition_mode) {
    case EditionMode.Pan:
      pan_end()
      break
    case EditionMode.Connect:
      connect_end()
      break
  }
})
