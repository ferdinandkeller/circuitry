import { enter_pan_mode, exit_pan_mode } from '@/modes/pan'
import { enter_connect_mode, exit_connect_mode } from '@/modes/connect'
import { renderer } from '@/canvas'

/**
 * Valid edition modes.
 */
export enum EditionMode {
  NONE = 'none',        // mode where you can't do anything
  PAN = 'pan',          // mode where you can pan the canvas
  CONNECT = 'connect',  // mode where you can connect modules
}

/**
 * The currently active edition mode.
 * 
 * @default EditionMode.NONE
 */
export let active_edition_mode = EditionMode.NONE

/**
 * Exits the active edition mode.
 */
function exit_active_mode() {
    if (active_edition_mode === EditionMode.PAN) exit_pan_mode()
    else if (active_edition_mode === EditionMode.CONNECT) exit_connect_mode()
}

// shortcuts to switch between edition modes
// we add the event listener to the renderer, because it's the element that contains the canvas
// we don't want to trigger the shortcuts when the mouse is outside the editor
renderer.addEventListener('keydown', (event: KeyboardEvent) => {
  // enable none mode
  if ((event.key === 'Escape' || event.key === 'n') && active_edition_mode !== EditionMode.NONE) {
    exit_active_mode()
    active_edition_mode = EditionMode.NONE
  }

  // enable pan mode
  else if (event.key === 'd' && active_edition_mode !== EditionMode.PAN) {
    exit_active_mode()
    active_edition_mode = EditionMode.PAN
    enter_pan_mode()
  }

  // enable connect mode
  else if (event.key === 'c' && active_edition_mode !== EditionMode.CONNECT) {
    exit_active_mode()
    active_edition_mode = EditionMode.CONNECT
    enter_connect_mode()
  }
})
