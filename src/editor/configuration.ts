// define the pixel ratio of the screen
// this is used to scale the canvas' resolution without affecting the look of the UI
// in high dpi screens, the canvas will be scaled up (for example retina displays will have a pixel ratio of 2)
export let pixel_ratio = window.devicePixelRatio

// UI parameters
export let block_size = 20
export let dot_size = 2
export let cross_width = 2
export let cross_size = 4

// UX parameters
export let connection_turn_threshold = 1.3
