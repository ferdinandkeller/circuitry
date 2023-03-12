import { Vector } from '@/utils/vector'
import { dot_size, dot_radius, cross_length, cross_width } from '@/editor/configuration'

// define a canvas context clearing method
export function clear_canvas(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

export function render_dot(ctx: CanvasRenderingContext2D, position: Vector) {
    ctx.beginPath()
    ctx.arc(position.x * dot_size, position.y * dot_size, dot_radius/2, 0, 2 * Math.PI)
    ctx.fill()
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
