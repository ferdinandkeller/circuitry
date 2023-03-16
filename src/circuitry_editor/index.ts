// import the styles for the circuitry editor
import './circuitry.scss'

// import the logic for the circuitry editor
import { Canvas } from './rendering/canvas'
import { Configuration } from './configuration'
import { modulo_ceiling } from './utils/math'
import { Vector } from './utils/vector'
import { Background } from './rendering/background'
import { Modes } from './modes'
import { Mouse } from './utils/mouse'
import { Components } from './rendering/components'
import { Component } from './rendering/component'

import FontFaceObserver from 'fontfaceobserver'

// export a function to create a new circuitry editor
export class CircuitryEditor {
    // the configuration of the circuitry editor
    configuration: Configuration = new Configuration()

    // globals
    /**
     * The viewbox position represents the top left corner of the visible area.
     * The viewbox size is equal to the canvas size.
     */
    viewbox_pos: Vector = Vector.zero()
    renderer_size: Vector = Vector.zero()


    mouse: Mouse = new Mouse(this)


    // main circuitry editor div
    // this div contains all the other elements of the circuitry editor
    circuitry_editor_div: HTMLDivElement

    // renderer div
    // this div contains all the canvas elements
    renderer_div: HTMLDivElement

    // canvas
    // this is the canvas where the circuitry editor is rendered
    static_background_canvas: Canvas
    background_canvas: Canvas
    connections_canvas: Canvas
    active_connection_canvas: Canvas
    components_canvas: Canvas

    // background
    background: Background = new Background(this)
    // components
    components: Component[] = []
    components_renderer: Components = new Components(this)

    modes: Modes = new Modes(this)

    constructor(circuitry_editor_div: HTMLDivElement) {
        // save the div reference
        this.circuitry_editor_div = circuitry_editor_div
        // label the div as a circuitry editor
        // this is needed for the css to work properly
        this.circuitry_editor_div.classList.add('circuitry-editor')
        // load configuration variables into the scope for css
        this.circuitry_editor_div.style.setProperty('--grid-size', this.configuration.grid_size + 'px')

        // generate the inner html structure of the circuitry editor
        this.generate_inner_html()

        // wait for the fonts to load before rendering the circuitry editor
        // else all the components with cached text will be rendered with the wrong font
        let font_observer = new FontFaceObserver('DM Mono', { weight: 500 })
        font_observer.load().then(() => {
            this.setup()
        })
    }

    setup() {
        // add the components
        this.components = [
            new Component(this, 'nand', new Vector(0, 0)),
            new Component(this, 'or', new Vector(0, 4)),
            new Component(this, 'and', new Vector(0, 8)),
        ]

        // handles the resizing of the window
        window.addEventListener('resize', () => this.full_render())

        // handles mouse down
        this.renderer_div.addEventListener('mousedown', (mouse_event: MouseEvent) => this.mouse_down(mouse_event))
        // handles mouse move
        window.addEventListener('mousemove', (mouse_event: MouseEvent) => this.mouse_move(mouse_event))
        // handles mouse up
        window.addEventListener('mouseup', (mouse_event: MouseEvent) => this.mouse_up(mouse_event))

        // handles key down
        window.addEventListener('keydown', (key_event) => this.key_down(key_event))
        // handles key up
        window.addEventListener('keyup', (key_event) => this.key_up(key_event))

        // render the circuitry editor for the first time
        this.full_render()
    }

    generate_inner_html() {
        // generate the renderer div
        this.renderer_div = document.createElement('div')
        this.renderer_div.classList.add('renderer')

        // generate the canvas
        this.static_background_canvas = new Canvas(this)
        this.background_canvas = new Canvas(this, 'background')
        this.connections_canvas = new Canvas(this, 'connections')
        this.active_connection_canvas = new Canvas(this, 'active-connection')
        this.components_canvas = new Canvas(this, 'components')

        // structure the canvas
        this.renderer_div.appendChild(this.background_canvas.canvas)
        this.renderer_div.appendChild(this.connections_canvas.canvas)
        this.renderer_div.appendChild(this.active_connection_canvas.canvas)
        this.renderer_div.appendChild(this.components_canvas.canvas)
        this.circuitry_editor_div.appendChild(this.renderer_div)
    }

    /**
     * This will render the circuitry editor from scratch.
     * This is used when the window is resized or at startup.
     * It will resize all the canvas, regenerate the static background, and do a normal render.
     */
    full_render() {
        // resize the canvas to the new size of the window
        this.resize()
        // render the static background
        this.background.render_static_background()
        // do a normal render pass
        this.render()
    }

    /**
     * This will render the circuitry editor.
     */
    render() {
        // render the background
        this.background.render_background()
        // render the connections
        // render the active connection
        // render the components
        this.components_renderer.render()
    }

    resize() {
        // move the viewbox to keep the center of the screen still in the center of the screen
        this.viewbox_pos.x -= (this.renderer_div.clientWidth - this.renderer_size.x) / 2
        this.viewbox_pos.y -= (this.renderer_div.clientHeight - this.renderer_size.y) / 2
        this.renderer_size.x = this.renderer_div.clientWidth
        this.renderer_size.y = this.renderer_div.clientHeight

        // resize the canvas
        this.static_background_canvas.resize(
            modulo_ceiling(this.renderer_size.x, this.configuration.grid_size) + this.configuration.grid_size,
            modulo_ceiling(this.renderer_size.y, this.configuration.grid_size) + this.configuration.grid_size
        )
        this.background_canvas.resize(this.renderer_size.x, this.renderer_size.y)
        this.active_connection_canvas.resize(this.renderer_size.x, this.renderer_size.y)
        this.connections_canvas.resize(this.renderer_size.x, this.renderer_size.y)
        this.components_canvas.resize(this.renderer_size.x, this.renderer_size.y)
    }

    key_down(keyboard_event: KeyboardEvent) {
        this.modes.key_down(keyboard_event)
    }

    key_up(keyboard_event: KeyboardEvent) {
        this.modes.key_up(keyboard_event)
    }

    /**
     * Register mousedown event on the renderer.
     * This is because this element contains the canvas.
     * We want to trigger mousedown handlers only when the user is clicking on the canvas.
     */
    mouse_down(mouse_event: MouseEvent) {
        this.mouse.update_mouse_pos(mouse_event.clientX, mouse_event.clientY)
        this.modes.mouse_down()
    }

    /**
     * Register mousemove event on the renderer.
     * We want to trigger mousemove handlers even if the user is not on the canvas anymore.
     */
    mouse_move(mouse_event: MouseEvent) {
        this.mouse.update_mouse_pos(mouse_event.clientX, mouse_event.clientY)
        this.modes.mouse_move()
    }

    /**
     * Register mousemove event on the window.
     * We want to trigger mouseup handlers even if the user is not on the canvas anymore.
     */
    mouse_up(mouse_event: MouseEvent) {
        this.mouse.update_mouse_pos(mouse_event.clientX, mouse_event.clientY)
        this.modes.mouse_up()
    }
}
