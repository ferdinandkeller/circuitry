import { Child } from "@/utils/child"
import { EditionMode } from "@/utils/edition_modes"
import { ComponentDragMode } from "./component_drag"
import { PanMode } from "./pan"

export class Modes extends Child {
    active_edition_mode: EditionMode = EditionMode.NONE
    pan: PanMode = new PanMode(this.circuitry_editor)
    component_drag: ComponentDragMode = new ComponentDragMode(this.circuitry_editor)

    mouse_down() {
        for (let component of this.circuitry_editor.components) {
            if (component.is_hovered()) {
                component.hover_animation()
                return
            }
        }
        if (this.active_edition_mode === EditionMode.PAN) this.pan.pan_start()
    }

    mouse_move() {
        if (this.active_edition_mode === EditionMode.NONE) return
        if (this.active_edition_mode === EditionMode.PAN) this.pan.pan_move()
    }

    mouse_up() {
        if (this.active_edition_mode === EditionMode.NONE) return
        if (this.active_edition_mode === EditionMode.PAN) this.pan.pan_end()
    }

    key_down(keyboard_event: KeyboardEvent) {
        if (keyboard_event.key === ' ') {
            if (keyboard_event.repeat) return
            this.exit_current_mode()
            this.pan.enter_pan_mode()
            this.active_edition_mode = EditionMode.PAN
        }
    }

    key_up(keyboard_event: KeyboardEvent) {
        if (keyboard_event.key === ' ') {
            this.exit_current_mode()
            this.active_edition_mode = EditionMode.NONE
        }
    }

    exit_current_mode() {
        if (this.active_edition_mode === EditionMode.PAN) this.pan.exit_pan_mode()
    }
}
