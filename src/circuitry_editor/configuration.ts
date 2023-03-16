export class Configuration {
    /**
     * define the pixel ratio of the screen
     * this is used to scale the canvas' resolution without affecting the look of the UI
     * in high dpi screens, the canvas will be scaled up (for example retina displays will have a pixel ratio of 2)
     */
    pixel_ratio: number = window.devicePixelRatio

    /**
     * The size of the grid in pixels.
     */
    grid_size: number = 20

    /**
     * The size of one grid dot in pixels.
     */
    dot_radius: number = 1

    /**
     * The width of a cross in pixels.
     */
    cross_width: number = 2

    /**
     * The size of a cross in pixels.
     */
    cross_length: number = 4

    /**
     * The size of the connection line in pixels.
     */
    connection_line_width: number = 4

    /**
     * The size of the connection dot in pixels.
     */
    connection_line_radius: number = 4

    /**
     * The threshold to consider a connection as a turn.
     * Here we chose 1.3 because it's bigger than 1, but also less than 1.5,
     * meaning that turning isn't too sensitive, but when turning we are still snaping to
     * the closest dot and not one after
     * (if 1.5 < threshold < 2.5, we would be snapping to the second dot, etc).
     */
    connection_turn_threshold: number = 1.3

    font_url: string = 'https://fonts.gstatic.com/s/dmmono/v10/aFTR7PB1QTsUX8KYvumzEY2tbYf-Vlh3uA.woff2'
}
