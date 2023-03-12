/**
 * define the pixel ratio of the screen
 * this is used to scale the canvas' resolution without affecting the look of the UI
 * in high dpi screens, the canvas will be scaled up (for example retina displays will have a pixel ratio of 2)
 */
export let pixel_ratio = window.devicePixelRatio

// UI parameters
/**
 * The size of the grid in pixels.
 */
export let dot_size = 20
/**
 * The size of one grid dot in pixels.
 */
export let dot_radius = 2
/**
 * The width of a cross in pixels.
 */
export let cross_width = 2
/**
 * The size of a cross in pixels.
 */
export let cross_length = 4

// UX parameters
/**
 * The threshold to consider a connection as a turn.
 * Here we chose 1.3 because it's bigger than 1, but also less than 1.5,
 * meaning that turning isn't too sensitive, but when turning we are still snaping to
 * the closest dot and not one after
 * (if 1.5 < threshold < 2.5, we would be snapping to the second dot, etc).
 */
export let connection_turn_threshold = 1.3
