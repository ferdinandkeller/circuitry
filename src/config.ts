import { enter_drag_mode, exit_drag_mode } from './drag'
import { enter_connect_mode, exit_connect_mode } from './connect'

// define the pixel ratio of the screen
export let pixel_ratio = window.devicePixelRatio

// define the edition mode valid states
export enum EditionMode {
  None,
  Drag,
  Connect,
}

// create a variable to store the active edition mode
export let edition_mode = EditionMode.None

// define a method to exit the active edition mode
function exit_active_mode() {
  switch (edition_mode) {
    case EditionMode.None:
      break
    case EditionMode.Drag:
      exit_drag_mode()
      break
    case EditionMode.Connect:
      exit_connect_mode()
      break
  }
}

// shortcuts to switch between edition modes
addEventListener('keydown', (event: KeyboardEvent) => {
  // enable none mode
  if ((event.key === 'Escape' || event.key === 'n') && edition_mode !== EditionMode.None) {
    exit_active_mode()
    edition_mode = EditionMode.None
  }

  // enable drag mode
  if (event.key === 'd' && edition_mode !== EditionMode.Drag) {
    exit_active_mode()
    edition_mode = EditionMode.Drag
    enter_drag_mode()
  }

  // enable connect mode
  if (event.key === 'c' && edition_mode !== EditionMode.Connect) {
    exit_active_mode()
    edition_mode = EditionMode.Connect
    enter_connect_mode()
  }
})

// rendering parameters
export let block_size = 20
export let dot_size = 2
export let cross_line_width = 2
export let cross_line_size = 4

// ux
export let connection_turn_threshold = 1.3