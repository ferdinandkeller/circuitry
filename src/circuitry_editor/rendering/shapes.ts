import { Vector } from '@/utils/vector'
import { Canvas } from './canvas'

export function render_rounded_rect(canvas: Canvas, position: Vector, width: number, height: number, radius: number) {
    canvas.ctx.beginPath()
    canvas.ctx.arc(position.x + radius, position.y + radius, radius, -Math.PI , -Math.PI/2)
    canvas.ctx.lineTo(position.x + width - radius, position.y)
    canvas.ctx.arc(position.x + width - radius, position.y + radius, radius, -Math.PI/2, 0)
    canvas.ctx.lineTo(position.x + width, position.y + height - radius)
    canvas.ctx.arc(position.x + width - radius, position.y + height - radius, radius, 0, Math.PI/2)
    canvas.ctx.lineTo(position.x + radius, position.y + height)
    canvas.ctx.arc(position.x + radius, position.y + height - radius, radius, Math.PI/2, Math.PI)
    canvas.ctx.closePath()
}
