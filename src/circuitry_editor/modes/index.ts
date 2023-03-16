import { Child } from "@/utils/child"
import { EditionMode } from "@/utils/edition_modes"
import { DragMode } from "./drag"
import { PanMode } from "./pan"

export class Modes extends Child {
    active_edition_mode: EditionMode = EditionMode.NONE

    pan: PanMode = new PanMode(this.circuitry_editor)
    drag: DragMode = new DragMode(this.circuitry_editor)

    stashed_modes: EditionMode[] = []

    mouse_down() {
        for (let component of this.circuitry_editor.components) {
            if (component.is_hovered()) {
                this.stash_current_mode()
                this.drag.component = component
                this.enter_mode(EditionMode.DRAG)
                this.drag.drag_start()
                return
            }
        }
        if (this.active_edition_mode === EditionMode.PAN) this.pan.pan_start()
    }

    mouse_move() {
        if (this.active_edition_mode === EditionMode.NONE) return
        if (this.active_edition_mode === EditionMode.DRAG) this.drag.drag_move()
        if (this.active_edition_mode === EditionMode.PAN) this.pan.pan_move()
    }

    mouse_up() {
        if (this.active_edition_mode === EditionMode.NONE) return
        if (this.active_edition_mode === EditionMode.DRAG) {
            this.drag.drag_end()
            this.unstash_last_mode()
        }
        if (this.active_edition_mode === EditionMode.PAN) this.pan.pan_end()
    }

    key_down(keyboard_event: KeyboardEvent) {
        if (keyboard_event.key === ' ') {
            if (keyboard_event.repeat) return
            this.exit_current_mode()
            this.pan.enter_pan()
            this.active_edition_mode = EditionMode.PAN
        }
    }

    key_up(keyboard_event: KeyboardEvent) {
        if (keyboard_event.key === ' ') {
            this.exit_current_mode()
        }
    }

    enter_mode(edition_mode: EditionMode) {
        if (this.active_edition_mode !== EditionMode.NONE) throw new Error('Cannot enter mode while another mode is active')
        this.active_edition_mode = edition_mode
        if (this.active_edition_mode === EditionMode.NONE) return
        if (this.active_edition_mode === EditionMode.PAN) this.pan.enter_pan()
        if (this.active_edition_mode === EditionMode.DRAG) this.drag.enter_drag()
    }

    exit_current_mode() {
        if (this.active_edition_mode === EditionMode.NONE) return
        if (this.active_edition_mode === EditionMode.PAN) this.pan.exit_pan()
        if (this.active_edition_mode === EditionMode.DRAG) this.drag.exit_drag()
        this.active_edition_mode = EditionMode.NONE
    }

    switch_mode(edition_mode: EditionMode) {
        if (this.active_edition_mode === edition_mode) return
        this.exit_current_mode()
        this.enter_mode(edition_mode)
    }

    stash_current_mode() {
        this.stashed_modes.push(this.active_edition_mode)
        this.exit_current_mode()
    }

    unstash_last_mode() {
        if (this.stashed_modes.length === 0) return
        this.switch_mode(this.stashed_modes.pop()!)
    }
}
