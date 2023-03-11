import { enter_drag_mode, exit_drag_mode } from './viewbox'
import { enter_connect_mode, exit_connect_mode } from './connect'

// define the pixel ratio of the screen
export let pixel_ratio = window.devicePixelRatio

// define the edition mode
export enum EditionMode {
  None,
  Drag,
  Connect,
}
export let edition_mode = EditionMode.Drag

// switch edition mode
addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === ' ') {
    if (edition_mode === EditionMode.Connect) {
      exit_connect_mode()
      enter_drag_mode()
      edition_mode = EditionMode.Drag
    } else {
      exit_drag_mode()
      enter_connect_mode()
      edition_mode = EditionMode.Connect
    }
  }
})

// rendering parameters
export let block_size = 20
export let dot_size = 2
export let center_line_width = 2
export let center_line_size = 4
