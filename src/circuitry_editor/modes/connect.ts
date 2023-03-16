// import { active_connection_ctx, renderer } from '@/rendering/canvas'
// import { clear_context } from '@/utils/rendering'
// import { cursor_world_pos, cursor_world_pos_dot } from '@/utils/mouse'
// import { dot_size, connection_turn_threshold } from '@/editor/configuration'
// import { Connection } from '@/utils/connection'
// import { Orientation } from '@/utils/orientation'

// // set connecting state variables
// let is_connecting = false

// // define a vector to store the connection points
// let connection: Connection

// // define an enum to store the current orientation of the connection
// let orientation = Orientation.Unknown

// // mod switch handlers
// export function enter_connect_mode() {
//     // add the mode class to the renderer
//     renderer.classList.add('connect-mode')
// }

// export function exit_connect_mode() {
//     // leave the connect mode
//     is_connecting = false
//     clear_context(active_connection_ctx)

//     // remove the mode class from the renderer
//     renderer.classList.remove('connect-mode')
// }

// // mouse movements handlers
// export function connect_start() {
//     if (is_connecting) return
//     is_connecting = true

//     // reset the connection points
//     connection = new Connection()

//     // reset the direction
//     orientation = Orientation.Unknown

//     // add the start and end points to the connection points
//     connection.points.push(cursor_world_pos_dot.copy())
//     connection.points.push(cursor_world_pos_dot.copy())

//     // clear the canvas
//     clear_context(active_connection_ctx)

//     // draw the start point
//     connection.render(active_connection_ctx)    
// }

// export function connect_move() {
//     if (!is_connecting) return

//     // get the endpoint and the one before it
//     let end_point_world_pos = connection.nth_point(-1)
//     let before_end_point_world_pos = connection.nth_point(-2)

//     // compute the delta between the start point and the current mouse position
//     let delta = cursor_world_pos.sub(before_end_point_world_pos).abs()

//     // update the end point
//     end_point_world_pos.set(cursor_world_pos_dot)

//     // try to find the orientation of the connection
//     // until it is properly determined, we prevent rendering anything
//     if (orientation === Orientation.Unknown) {
//         // check if we are more than some distance away from the start point
//         // if so, set the orientation
//         if (delta.x >= connection_turn_threshold * dot_size) {
//             orientation = Orientation.Horizontal
//         } else if (delta.y >= connection_turn_threshold * dot_size) {
//             orientation = Orientation.Vertical
//         } else {
//             // if the starting orientation is still undetermined,
//             // we prevent rendering anything by returning early
//             return
//         }
//     }
    
//     // depending on the orientation, detect if we need to turn
//     if (orientation === Orientation.Horizontal) {
//         // if in horizontal mode, restrain the vertical movement
//         // but if the mouse is more than some distance away from x axis, turn
//         end_point_world_pos.y = before_end_point_world_pos.y
//         if (delta.y > connection_turn_threshold * dot_size) {
//             connection.points.push(end_point_world_pos.copy())
//             orientation = Orientation.Vertical
//         }
//     }
//     else if (orientation === Orientation.Vertical) {
//         // if in vertical mode, restrain the horizontal movement
//         // but if the mouse is more than some distance away from y axis, turn
//         end_point_world_pos.x = before_end_point_world_pos.x
//         if (delta.x > connection_turn_threshold * dot_size) {
//             connection.points.push(end_point_world_pos.copy())
//             orientation = Orientation.Horizontal
//         }
//     }

//     // simplify the connection
//     connection.simplify_connection()

//     // clear the canvas & render the connection
//     clear_context(active_connection_ctx)
//     connection.render(active_connection_ctx)
// }

// export function connect_end() {
//     if (!is_connecting) return
//     is_connecting = false

//     // clear the canvas
//     clear_context(active_connection_ctx)
// }
