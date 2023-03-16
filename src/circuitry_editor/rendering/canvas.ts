import { CircuitryEditor } from "@"
import { Child } from "@/utils/child"
import { Vector } from "@/utils/vector"

/**
 * An HTML canvas element with its 2D context.
 * No uncertainty about the context.
 * No need to worry about the pixel ratio.
 */
export class Canvas extends Child {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D

    constructor(circuitry_editor: CircuitryEditor, classes: string[] | string = []) {
        // save the circuitry editor
        super(circuitry_editor)

        // generate a new canvas element
        this.canvas = document.createElement('canvas')

        // try to pull the 2D context from the canvas
        let maybe_ctx = this.canvas.getContext('2d')

        // throw an error if the context could not be pulled
        if (maybe_ctx === null) { throw new Error('Could not create a new canvas with 2D context') }

        // save the context
        this.ctx = maybe_ctx

        // add the classes to the canvas
        if (typeof classes === 'string') { classes = [classes] }
        for (let class_name of classes) {
            this.canvas.classList.add(class_name)
        }

        // add an event listener to automatically delete the canvas, because canvas in safari are quite buggy
        // when the window is reloaded, the canvas are deleted but the memory is not freed up
        // this is a workaround to free the memory, where before the window is unloaded,
        // the canvas are resized to be 0x0, which free up the memory correctly
        window.addEventListener('beforeunload', () => {
            this.canvas.width = 0
            this.canvas.height = 0
        })
    }

    resize(width: number, height: number) {
        this.canvas.width = this.circuitry_editor.configuration.pixel_ratio * width
        this.canvas.height = this.circuitry_editor.configuration.pixel_ratio * height
        this.ctx.scale(
            this.circuitry_editor.configuration.pixel_ratio,
            this.circuitry_editor.configuration.pixel_ratio
        )
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    draw_image(canvas: Canvas, position: Vector) {
        this.ctx.drawImage(
            // the image (actually a canvas)
            canvas.canvas,
            // where to draw the canvas (top and left corners)
            Math.round(position.x), Math.round(position.y),
            // the size of the canvas (we are scaling it using the pixel ratio)
            canvas.ctx.canvas.width / this.circuitry_editor.configuration.pixel_ratio,
            canvas.ctx.canvas.height / this.circuitry_editor.configuration.pixel_ratio
        )
    }
}
