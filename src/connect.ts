import { connections_ctx, renderer } from './canvas'
import { Vector, clear_canvas } from './utils'
import { viewbox_pos } from './viewbox'
import { mouse_world_pos, mouse_world_pos_block, mouse_screen_pos_block } from './mouse'
import { cross_line_size, cross_line_width, dot_size, block_size, connection_turn_threshold } from './config'

// set connecting state variables
let is_connecting = false
let connect_start_world_pos_block = Vector.zero()
let connect_end_word_pos_block = Vector.zero()

// define an enum to store the current direction of the connection
enum Direction {
    Unset,
    Horizontal,
    Vertical,
}
let direction = Direction.Unset

// define a vector to store the connection points
let connection_points: Vector[] = []

// mod switch handlers
export function enter_connect_mode() {
    // add the mode class to the renderer
    renderer.classList.add('connect-mode')
}

export function exit_connect_mode() {
    // leave the connect mode
    is_connecting = false
    clear_canvas(connections_ctx)

    // remove the mode class from the renderer
    renderer.classList.remove('connect-mode')
}

// mouse movements handlers
export function connect_start() {
    if (is_connecting) return
    is_connecting = true

    // reset the connection points
    connection_points = []

    // reset the direction
    direction = Direction.Unset

    // initialise the start and end points
    connect_start_world_pos_block.set(mouse_world_pos_block)
    connect_end_word_pos_block.set(mouse_world_pos_block)

    // add the start point to the connection points
    connection_points.push(connect_start_world_pos_block.copy())

    // clear the canvas
    clear_canvas(connections_ctx)

    // draw the start point
    connections_ctx.fillStyle = 'hsl(240, 7%, 20%)'
    connections_ctx.beginPath()
    connections_ctx.arc(connect_start_world_pos_block.x - viewbox_pos.x, connect_start_world_pos_block.y - viewbox_pos.y, 2 * dot_size, 0, 2 * Math.PI)
    connections_ctx.fill()
}

export function connect_move() {
    if (!is_connecting) connect_move_visualising()
    else connect_move_connecting()
}

function connect_move_visualising() {
    // clear the canvas
    clear_canvas(connections_ctx)

    // draw the cross
    connections_ctx.strokeStyle = 'hsl(240, 7%, 85%)'
    connections_ctx.lineWidth = cross_line_width
    connections_ctx.lineCap = 'round'

    connections_ctx.beginPath()
    connections_ctx.moveTo(mouse_screen_pos_block.x - cross_line_size, mouse_screen_pos_block.y)
    connections_ctx.lineTo(mouse_screen_pos_block.x + cross_line_size, mouse_screen_pos_block.y)
    connections_ctx.stroke()

    connections_ctx.beginPath()
    connections_ctx.moveTo(mouse_screen_pos_block.x, mouse_screen_pos_block.y - cross_line_size)
    connections_ctx.lineTo(mouse_screen_pos_block.x, mouse_screen_pos_block.y + cross_line_size)
    connections_ctx.stroke()
}

function connect_move_connecting() {
    // compute the delta between the start point and the current mouse position
    let delta = mouse_world_pos.sub(connect_start_world_pos_block).abs()

    // update the end point
    connect_end_word_pos_block.set(mouse_world_pos_block)

    // find the direction of the connection
    if (direction === Direction.Unset) {
        // check if we are more than half a block away from the start point
        // if so, set the direction
        if (delta.x > block_size) {
            direction = Direction.Horizontal
        } else if (delta.y > block_size) {
            direction = Direction.Vertical
        }
    }
    
    // depending on the direction, detect if we need to turn
    if (direction === Direction.Horizontal) {
        // if in horizontal mode, restrain the vertical movement
        // but if the mouse is more than some distance away from x axis, turn
        if (delta.y > connection_turn_threshold * block_size) {
            connect_start_world_pos_block.x = connect_end_word_pos_block.x
            connection_points.push(connect_start_world_pos_block.copy())
            direction = Direction.Vertical
        } else {
            connect_end_word_pos_block.y = connect_start_world_pos_block.y
        }
    }
    else if (direction === Direction.Vertical) {
        // if in vertical mode, restrain the horizontal movement
        // but if the mouse is more than some distance away from y axis, turn
        if (delta.x > connection_turn_threshold * block_size) {
            connect_start_world_pos_block.y = connect_end_word_pos_block.y
            connection_points.push(connect_start_world_pos_block.copy())
            direction = Direction.Horizontal
        } else {
            connect_end_word_pos_block.x = connect_start_world_pos_block.x
        }
    }

    // // check for overlapping between lines
    // // connection_points.push([connect_end_x, connect_end_y])
    // // simplify_connection()
    // // connection_points.pop()

    // clear the canvas
    connections_ctx.clearRect(0, 0, connections_ctx.canvas.width, connections_ctx.canvas.height)

    // set the line styles
    connections_ctx.fillStyle = 'hsl(240, 7%, 20%)'
    connections_ctx.strokeStyle = 'hsl(240, 7%, 20%)'
    connections_ctx.lineWidth = dot_size * 2
    connections_ctx.lineCap = 'butt'

    // convert the connect start and end point to screen coordinates
    let connect_start_screen_pos_block = connect_start_world_pos_block.to_screen()
    let connect_end_screen_pos_block = connect_end_word_pos_block.to_screen()

    // draw the current line
    connections_ctx.beginPath()
    connections_ctx.moveTo(connect_start_screen_pos_block.x, connect_start_screen_pos_block.y)
    connections_ctx.lineTo(connect_end_screen_pos_block.x, connect_end_screen_pos_block.y)
    connections_ctx.stroke()

    // draw the other lines
    for (let point_index = 0; point_index < connection_points.length-1; point_index++) {
        // convert the point to screen coordinates
        let start_point_screen = connection_points[point_index].to_screen()
        let end_point_screen = connection_points[point_index+1].to_screen()

        // draw the point
        connections_ctx.beginPath()
        connections_ctx.moveTo(start_point_screen.x, start_point_screen.y)
        connections_ctx.lineTo(end_point_screen.x, end_point_screen.y)
        connections_ctx.stroke()
    }

    // draw the current start point
    connections_ctx.beginPath()
    connections_ctx.arc(connect_start_screen_pos_block.x, connect_start_screen_pos_block.y, 2 * dot_size, 0, 2 * Math.PI)
    connections_ctx.fill()
    
    // draw the current end point
    connections_ctx.beginPath()
    connections_ctx.arc(connect_end_screen_pos_block.x, connect_end_screen_pos_block.y, 2 * dot_size, 0, 2 * Math.PI)
    connections_ctx.fill()

    // draw the other points
    for (let world_point of connection_points) {
        // convert the point to screen coordinates
        let point_screen = world_point.to_screen()

        // draw the point
        connections_ctx.beginPath()
        connections_ctx.arc(point_screen.x, point_screen.y, 2 * dot_size, 0, 2 * Math.PI)
        connections_ctx.fill()
    }
}

export function connect_end() {
    if (!is_connecting) return
    is_connecting = false

    // clear the canvas
    clear_canvas(connections_ctx)

    // draw the cursor position
    connect_move_visualising()
}

// function simplify_connection() {
//     // simplify the connection by removing the points that are on the same line
//     // or a line that crosses another line

//     // if there are less than 2 points, there is nothing to simplify
//     if (connection_points.length < 2) return

//     // test if the line starts horizontally or vertically
//     let direction = connection_points[0][0] === connection_points[1][0] ? Direction.Vertical : Direction.Horizontal

//     // flag to check if the connection has changed
//     let has_changed = false

//     point_loop: for (let line_1_index = 0; line_1_index < connection_points.length-1; line_1_index++) {
//         for (let line_2_index = line_1_index + 3; line_2_index < connection_points.length-1; line_2_index += 2) {
//             // check for overlapping lines
//             let line_1: [[number, number], [number, number]] = [connection_points[line_1_index], connection_points[line_1_index+1]]
//             let line_2: [[number, number], [number, number]] = [connection_points[line_2_index], connection_points[line_2_index+1]]
//             if (do_lines_overlap(direction, line_1, line_2)) {
//                 // move the second point of the first line
//                 if (direction === Direction.Horizontal) {
//                     connection_points[line_1_index+1][0] = connection_points[line_2_index][0]
//                 } else if (direction === Direction.Vertical) {
//                     connection_points[line_1_index+1][1] = connection_points[line_2_index][1]
//                 }
//                 // remove the unnecessary points
//                 connection_points.splice(line_1_index+2, line_2_index - line_1_index - 1)
//                 // flag the connection as changed
//                 has_changed = true
//                 // exit the loop
//                 break point_loop
//             }
//         }

//         // switch the direction
//         if (direction === Direction.Horizontal) {
//             direction = Direction.Vertical
//         } else {
//             direction = Direction.Horizontal
//         }
//     }

//     // if the connection changed, simplify it again
//     if (has_changed) simplify_connection()
// }

// function do_lines_overlap(direction: Direction, line_1: [[number, number], [number, number]], line_2: [[number, number], [number, number]]) {
//     if (direction === Direction.Horizontal) {
//         let line_1_y_axis = line_1[0][1]
//         let line_2_x_axis = line_2[0][0]
//         return  (
//                     (line_2[0][1] < line_1_y_axis && line_1_y_axis < line_2[1][1]) ||
//                     (line_2[1][1] < line_1_y_axis && line_1_y_axis < line_2[0][1])
//                 ) && (
//                     (line_1[0][0] < line_2_x_axis && line_2_x_axis < line_1[1][0]) ||
//                     (line_1[1][0] < line_2_x_axis && line_2_x_axis < line_1[0][0])
//                 )
//     } else if (direction === Direction.Vertical) {
//         let line_1_x_axis = line_1[0][0]
//         let line_2_y_axis = line_2[0][1]
//         return  (
//                     (line_2[0][0] < line_1_x_axis && line_1_x_axis < line_2[1][0]) ||
//                     (line_2[1][0] < line_1_x_axis && line_1_x_axis < line_2[0][0])
//                 ) && (
//                     (line_1[0][1] < line_2_y_axis && line_2_y_axis < line_1[1][1]) ||
//                     (line_1[1][1] < line_2_y_axis && line_2_y_axis < line_1[0][1])
//                 )
//     }
//     return false
// }