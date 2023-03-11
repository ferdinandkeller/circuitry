import { enter_drag_mode, exit_drag_mode } from './drag'
import { enter_connect_mode, exit_connect_mode } from './connect'

// define the pixel ratio of the screen
export let pixel_ratio = window.devicePixelRatio

// define the edition mode
export enum EditionMode {
  None,
  Drag,
  Connect,
}
export let edition_mode = EditionMode.None

// shortcuts to switch between edition modes
addEventListener('keydown', (event: KeyboardEvent) => {
  // enable none mode
  if ((event.key === 'Escape' || event.key === 'n') && edition_mode !== EditionMode.None) {
    if (edition_mode === EditionMode.Drag) exit_drag_mode()
    if (edition_mode === EditionMode.Connect) exit_connect_mode()
    edition_mode = EditionMode.None
  }

  // enable drag mode
  if (event.key === 'd' && edition_mode !== EditionMode.Drag) {
    if (edition_mode === EditionMode.Connect) exit_connect_mode()
    edition_mode = EditionMode.Drag
    enter_drag_mode()
  }

  // enable connect mode
  if (event.key === 'c' && edition_mode !== EditionMode.Connect) {
    if (edition_mode === EditionMode.Drag) exit_drag_mode()
    edition_mode = EditionMode.Connect
    enter_connect_mode()
  }
})

// rendering parameters
export let block_size = 20
export let dot_size = 2
export let center_line_width = 2
export let center_line_size = 4
