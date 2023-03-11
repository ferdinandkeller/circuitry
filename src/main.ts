// import styles
import './style.scss'

// import ui logic
import { EditionMode, edition_mode } from './config'
import { resize_canvas } from './canvas'
import { render_background, render_static_background } from './background'
import { drag_start, drag_move, drag_end } from './drag'
import { connect_start, connect_move, connect_end } from './connect'

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

// register mouse events
window.addEventListener('mousedown', (event: MouseEvent) => {
  switch (edition_mode) {
    case EditionMode.Drag:
      drag_start(event)
      break
    case EditionMode.Connect:
      connect_start(event)
      break
  }
})

window.addEventListener('mousemove', (event: MouseEvent) => {
  switch (edition_mode) {
    case EditionMode.Drag:
      drag_move(event)
      break
    case EditionMode.Connect:
      connect_move(event)
      break
  }
})

window.addEventListener('mouseup', (event: MouseEvent) => {
  switch (edition_mode) {
    case EditionMode.Drag:
      drag_end(event)
      break
    case EditionMode.Connect:
      connect_end(event)
      break
  }
})
