// define the pixel ratio of the screen
export let pixel_ratio = window.devicePixelRatio

// define a stat
export enum MouseOperation {
  None,
  Drag,
  Connect,
}
export let mouse_operation = MouseOperation.Drag

// rendering parameters
export let block_size = 20
export let dot_size = 2
export let center_line_width = 3
export let center_line_size = 5
