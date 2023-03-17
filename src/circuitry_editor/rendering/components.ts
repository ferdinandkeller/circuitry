import { Child } from "@/utils/child"

export class Components extends Child {
    render() {
        this.circuitry_editor.components_canvas.clear()
        for (let component of this.circuitry_editor.components) {
            component.render_shadow()
        }
        for (let component of this.circuitry_editor.components) {
            component.render_component()
        }
    }

    is_hovering() {
        let rerender = false
        for (let component of this.circuitry_editor.components) {
            if (component.update_hover()) {
                rerender = true
            }
        }
    }
}
