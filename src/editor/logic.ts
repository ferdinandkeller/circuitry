import { enter_pan_mode, exit_pan_mode } from '../pan'
import { enter_connect_mode, exit_connect_mode } from '../connect'

// define the edition mode valid states
export enum EditionMode {
  None,     // mode where you can't do anything
  Pan,     // mode where you can pan the canvas
  Connect,  // mode where you can connect modules
}

// create a variable to store the active edition mode
export let edition_mode = EditionMode.None

// define a method to exit the active edition mode
function exit_active_mode() {
    if (edition_mode === EditionMode.Pan) exit_pan_mode()
    else if (edition_mode === EditionMode.Connect) exit_connect_mode()
}

// shortcuts to switch between edition modes
addEventListener('keydown', (event: KeyboardEvent) => {
  // enable none mode
  if ((event.key === 'Escape' || event.key === 'n') && edition_mode !== EditionMode.None) {
    exit_active_mode()
    edition_mode = EditionMode.None
  }

  // enable pan mode
  if (event.key === 'd' && edition_mode !== EditionMode.Pan) {
    exit_active_mode()
    edition_mode = EditionMode.Pan
    enter_pan_mode()
  }

  // enable connect mode
  if (event.key === 'c' && edition_mode !== EditionMode.Connect) {
    exit_active_mode()
    edition_mode = EditionMode.Connect
    enter_connect_mode()
  }
})