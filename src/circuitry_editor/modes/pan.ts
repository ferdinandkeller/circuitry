import { Child } from '@/utils/child'
import { Vector } from '@/utils/vector'

export class PanMode extends Child {
    // set viewbox panning state variables
    is_panning: boolean = false
    pan_start_mouse_pos: Vector = Vector.zero()
    pan_start_viewbox_pos: Vector = Vector.zero()

    // mode switch handlers
    enter_pan_mode() {
        // add the mode class to the editor div
        this.circuitry_editor.circuitry_editor_div.classList.add('pan-mode')
        // .classList.add('pan-mode')
    }

    exit_pan_mode() {
        // leave the panning mode
        if (this.is_panning) { this.is_panning = false }

        // remove the mode class from the renderer
        this.circuitry_editor.circuitry_editor_div.classList.remove('pan-mode')
    }

    // mouse movements handlers
    pan_start() {
        if (this.is_panning) return
        this.is_panning = true

        this.pan_start_mouse_pos.set(this.circuitry_editor.mouse.world_pos)
        this.pan_start_viewbox_pos.set(this.circuitry_editor.viewbox_pos)
    }

    pan_move() {
        if (!this.is_panning) return

        let delta_pos = this.circuitry_editor.mouse.world_pos.sub(this.pan_start_mouse_pos)
        let pan_end_viewbox_pos = this.circuitry_editor.viewbox_pos.sub(delta_pos)
        this.circuitry_editor.viewbox_pos.set(pan_end_viewbox_pos)

        this.circuitry_editor.render()
    }

    pan_end() {
        if (!this.is_panning) return
        this.is_panning = false
    }
}
