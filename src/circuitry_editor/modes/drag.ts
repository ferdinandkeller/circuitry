import { Component } from "@/rendering/component"
import { Child } from "@/utils/child"
import { Vector } from "@/utils/vector"

export class DragMode extends Child {
    component: Component

    is_dragging: boolean = false
    drag_start_mouse_pos: Vector = Vector.zero()
    drag_start_component_pos: Vector = Vector.zero()

    enter_drag() {
        this.circuitry_editor.circuitry_editor_div.classList.add('drag-mode')
    }

    exit_drag() {
        this.is_dragging = false
        this.circuitry_editor.circuitry_editor_div.classList.remove('drag-mode')
    }

    drag_start() {
        if (this.is_dragging) return
        this.is_dragging = true

        this.drag_start_mouse_pos.set(this.circuitry_editor.mouse.world_pos)
        this.drag_start_component_pos.set(this.component.position)
    }

    drag_move() {
        if (!this.is_dragging) return

        let delta_pos = this.circuitry_editor.mouse.world_pos.sub(this.drag_start_mouse_pos)
        let delta_pos_grid = delta_pos.modulo_rounding(this.circuitry_editor.configuration.grid_size)
        let drag_end_component_pos = this.drag_start_component_pos.add(delta_pos_grid)
        this.component.position.set(drag_end_component_pos)

        this.circuitry_editor.render()
    }

    drag_end() {
        if (!this.is_dragging) return
        this.is_dragging = false
    }
}
