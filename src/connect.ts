import { connections_ctx, renderer } from './canvas'
import { integer_rounding } from './utils'
import { viewbox_x, viewbox_y } from './viewbox'
import { block_size, center_line_size, center_line_width, dot_size } from './config'

let is_connecting = false
let connect_start_x = 0
let connect_start_y = 0
let connect_end_x = 0
let connect_end_y = 0

export function enter_connect_mode() {
    // enter connect mode
    renderer.classList.add('connect-mode')
}

export function exit_connect_mode() {
    // clear the canvas
    connections_ctx.clearRect(0, 0, connections_ctx.canvas.width, connections_ctx.canvas.height)

    // leave connect mode
    renderer.classList.remove('connect-mode')
}

export function connect_start(e: MouseEvent) {
    if (is_connecting) return
    is_connecting = true

    // get current mouse position on the canvas
    let mouse_x = e.clientX + viewbox_x
    let mouse_y = e.clientY + viewbox_y

    // find the closest round point
    connect_start_x = integer_rounding(mouse_x, block_size)
    connect_start_y = integer_rounding(mouse_y, block_size)

    // clear the canvas
    connections_ctx.clearRect(0, 0, connections_ctx.canvas.width, connections_ctx.canvas.height)

    // draw a start point
    connections_ctx.fillStyle = 'hsl(240, 7%, 20%)'
    connections_ctx.beginPath()
    connections_ctx.arc(connect_start_x - viewbox_x, connect_start_y - viewbox_y, 2 * dot_size, 0, 2 * Math.PI)
    connections_ctx.fill()
}

export function connect_move(e: MouseEvent) {
    if (!is_connecting) connect_move_before(e)
    else connect_move_during(e)
}

function connect_move_before(e: MouseEvent) {
    // get current mouse position on the canvas
    let mouse_x = e.clientX + viewbox_x
    let mouse_y = e.clientY + viewbox_y
    
    // find the closest round point
    let close_round_x = integer_rounding(mouse_x, block_size)
    let close_round_y = integer_rounding(mouse_y, block_size)

    // clear the canvas
    connections_ctx.clearRect(0, 0, connections_ctx.canvas.width, connections_ctx.canvas.height)

    // draw the point
    connections_ctx.strokeStyle = 'hsl(240, 7%, 85%)'
    connections_ctx.lineWidth = center_line_width
    connections_ctx.lineCap = 'round'

    connections_ctx.beginPath()
    connections_ctx.moveTo(close_round_x - viewbox_x - center_line_size, close_round_y - viewbox_y)
    connections_ctx.lineTo(close_round_x - viewbox_x + center_line_size, close_round_y - viewbox_y)
    connections_ctx.stroke()

    connections_ctx.beginPath()
    connections_ctx.moveTo(close_round_x - viewbox_x, close_round_y - viewbox_y - center_line_size)
    connections_ctx.lineTo(close_round_x - viewbox_x, close_round_y - viewbox_y + center_line_size)
    connections_ctx.stroke()
}

function connect_move_during(e: MouseEvent) {
    // get current mouse position on the canvas
    let mouse_x = e.clientX + viewbox_x
    let mouse_y = e.clientY + viewbox_y

    // find the closest round point
    connect_end_x = integer_rounding(mouse_x, block_size)
    connect_end_y = integer_rounding(mouse_y, block_size)

    // clear the canvas
    connections_ctx.clearRect(0, 0, connections_ctx.canvas.width, connections_ctx.canvas.height)

    // set colors
    connections_ctx.fillStyle = 'hsl(240, 7%, 20%)'
    connections_ctx.strokeStyle = 'hsl(240, 7%, 20%)'
    connections_ctx.lineWidth = dot_size * 2
    connections_ctx.lineCap = 'butt'

    // draw a line
    connections_ctx.beginPath()
    connections_ctx.moveTo(connect_start_x - viewbox_x, connect_start_y - viewbox_y)
    connections_ctx.lineTo(connect_end_x - viewbox_x, connect_end_y - viewbox_y)
    connections_ctx.stroke()

    // draw a start point
    connections_ctx.beginPath()
    connections_ctx.arc(connect_start_x - viewbox_x, connect_start_y - viewbox_y, 2 * dot_size, 0, 2 * Math.PI)
    connections_ctx.fill()
    
    // draw a end point
    connections_ctx.beginPath()
    connections_ctx.arc(connect_end_x - viewbox_x, connect_end_y - viewbox_y, 2 * dot_size, 0, 2 * Math.PI)
    connections_ctx.fill()
}

export function connect_end(e: MouseEvent) {
    if (!is_connecting) return
    is_connecting = false

    // clear the canvas
    connections_ctx.clearRect(0, 0, connections_ctx.canvas.width, connections_ctx.canvas.height)

    // draw the cursor position
    connect_move_before(e)
}

// document.addEventListener('mousedown', (e: MouseEvent) => {
//   // find closest starting point
//   start_x = integer_rounding(e.clientX - current_x, block_size)
//   start_y = integer_rounding(e.clientY - current_y, block_size)

//   // draw the starting point
//   conn_ctx.fillStyle = 'hsl(240, 7%, 20%)'
//   conn_ctx.clearRect(0, 0, conn_ctx.canvas.width, conn_ctx.canvas.height)
//   conn_ctx.beginPath()
//   conn_ctx.arc(start_x + current_x, start_y + current_y, dot_size * 2, 0, 2 * Math.PI)
//   conn_ctx.fill()  
// })

// document.addEventListener('mousemove', (e: MouseEvent) => {
//   // find closest end point
//   end_x = integer_rounding(e.clientX - current_x, block_size)
//   end_y = integer_rounding(e.clientY - current_y, block_size)

//   // draw the starting point
//   conn_ctx.fillStyle = 'hsl(240, 7%, 20%)'
//   conn_ctx.clearRect(0, 0, conn_ctx.canvas.width, conn_ctx.canvas.height)
//   conn_ctx.beginPath()
//   conn_ctx.arc(start_x + current_x, start_y + current_y, dot_size * 2, 0, 2 * Math.PI)
//   conn_ctx.fill()

//   // draw the line
//   conn_ctx.strokeStyle = 'hsl(240, 7%, 20%)'
//   conn_ctx.lineWidth = dot_size * 2
//   conn_ctx.lineCap = 'butt'
//   conn_ctx.beginPath()
//   conn_ctx.moveTo(start_x + current_x, start_y + current_y)
//   conn_ctx.lineTo(end_x + current_x, end_y + current_y)
//   conn_ctx.stroke()

//   // draw the end point
//   conn_ctx.fillStyle = 'hsl(240, 7%, 20%)'
//   conn_ctx.beginPath()
//   conn_ctx.arc(end_x + current_x, end_y + current_y, dot_size * 2, 0, 2 * Math.PI)
//   conn_ctx.fill()  
// })

// document.addEventListener('mouseup', (e: MouseEvent) => {
//   // clean the canvas
//   conn_ctx.clearRect(0, 0, conn_ctx.canvas.width, conn_ctx.canvas.height)

//   // turn off connect dragging
//   is_connect_dragging = false
// })
