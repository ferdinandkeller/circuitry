import { Vector } from '@/utils/vector'
import { cross_length, cross_width } from '@/editor/configuration'

// define a context clearing method
export function clear_context(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

export function free_canvas(canvas: HTMLCanvasElement | null) {
    if (canvas === null) { throw new Error('The provided canvas is invalid') }
    canvas.width = 0
    canvas.height = 0
}

export function render_circle(ctx: CanvasRenderingContext2D, position: Vector, diameter: number) {
    ctx.beginPath()
    ctx.arc(position.x, position.y, diameter/2, 0, 2 * Math.PI)
    ctx.fill()
    ctx.closePath()
}

export function render_rounded_rect(ctx: CanvasRenderingContext2D, position: Vector, width: number, height: number, radius: number) {
    ctx.beginPath()
    ctx.arc(position.x + radius, position.y + radius, radius, -Math.PI , -Math.PI/2)
    ctx.lineTo(position.x + width - radius, position.y)
    ctx.arc(position.x + width - radius, position.y + radius, radius, -Math.PI/2, 0)
    ctx.lineTo(position.x + width, position.y + height - radius)
    ctx.arc(position.x + width - radius, position.y + height - radius, radius, 0, Math.PI/2)
    ctx.lineTo(position.x + radius, position.y + height)
    ctx.arc(position.x + radius, position.y + height - radius, radius, Math.PI/2, Math.PI)
    ctx.closePath()
}

export function render_cross(ctx: CanvasRenderingContext2D, position: Vector) {
    // set the cross parameters
    ctx.lineWidth = cross_width
    ctx.lineCap = 'round'

    // render the first line
    ctx.beginPath()
    ctx.moveTo(position.x - cross_length, position.y)
    ctx.lineTo(position.x + cross_length, position.y)
    ctx.stroke()

    // render the second line
    ctx.beginPath()
    ctx.moveTo(position.x, position.y - cross_length)
    ctx.lineTo(position.x, position.y + cross_length)
    ctx.stroke()
}
