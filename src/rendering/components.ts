import { Component } from "@/utils/component"
import { components_ctx } from '@/rendering/canvas'
import {clear_context} from '@/utils/rendering'
import { Vector } from '@/utils/vector'

let components = [
    new Component(new Vector(3, 0)),
    new Component(new Vector(0, 6)),
]

export function detect_hover() {
    for (let component of components) {
        if (component.is_hovered()) {
            return true
        }
    }
    return false
}

export function render_components() {
    // clear the components canvas
    clear_context(components_ctx)

    // save the canvas context
    components_ctx.save()

    // render all components
    for (let component of components) {
        component.render(components_ctx)
    }

    // restore the canvas context
    components_ctx.restore()
}
