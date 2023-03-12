import { connections_ctx, renderer } from './canvas'
import { clear_canvas } from './utils/rendering'
import { Vector } from './utils/vector'
import { viewbox_pos } from './viewbox'
import { mouse_world_pos, mouse_world_pos_block } from './mouse'
import { dot_size, block_size, connection_turn_threshold } from './config'

// set connecting state variables
let is_connecting = false

// define a vector to store the connection points
let connection_points: Vector[] = []

// define an enum to store the current orientation of the connection
enum Orientation {
    Unknown,
    Horizontal,
    Vertical,
}
let orientation = Orientation.Unknown

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
    orientation = Orientation.Unknown

    // add the start and end points to the connection points
    connection_points.push(mouse_world_pos_block.copy())
    connection_points.push(mouse_world_pos_block.copy())

    // clear the canvas
    clear_canvas(connections_ctx)

    // draw the start point
    connections_ctx.fillStyle = 'hsl(240, 7%, 20%)'
    connections_ctx.beginPath()
    connections_ctx.arc(connection_points[0].x - viewbox_pos.x, connection_points[0].y - viewbox_pos.y, 2 * dot_size, 0, 2 * Math.PI)
    connections_ctx.fill()
}

export function connect_move() {
    if (!is_connecting) return

    // get the endpoint and the one before it
    let end_point_world_pos = connection_points[connection_points.length - 1]
    let before_end_point_world_pos = connection_points[connection_points.length - 2]

    // compute the delta between the start point and the current mouse position
    let delta = mouse_world_pos.sub(before_end_point_world_pos).abs()

    // update the end point
    end_point_world_pos.set(mouse_world_pos_block)

    // find the orientation of the connection
    if (orientation === Orientation.Unknown) {
        // check if we are more than some distance away from the start point
        // if so, set the orientation
        if (delta.x >= connection_turn_threshold * block_size) {
            orientation = Orientation.Horizontal
        } else if (delta.y >= connection_turn_threshold * block_size) {
            orientation = Orientation.Vertical
        }
        // if the starting orientation is still undetermined,
        // we prevent rendering anything by returning early
        return
    }
    
    // depending on the orientation, detect if we need to turn
    if (orientation === Orientation.Horizontal) {
        // if in horizontal mode, restrain the vertical movement
        // but if the mouse is more than some distance away from x axis, turn
        end_point_world_pos.y = before_end_point_world_pos.y
        if (delta.y > connection_turn_threshold * block_size) {
            connection_points.push(end_point_world_pos.copy())
            orientation = Orientation.Vertical
        }
    }
    else if (orientation === Orientation.Vertical) {
        // if in vertical mode, restrain the horizontal movement
        // but if the mouse is more than some distance away from y axis, turn
        end_point_world_pos.x = before_end_point_world_pos.x
        if (delta.x > connection_turn_threshold * block_size) {
            connection_points.push(end_point_world_pos.copy())
            orientation = Orientation.Horizontal
        }
    }

    // simplify the connection
    simplify_connection()

    // clear the canvas
    connections_ctx.clearRect(0, 0, connections_ctx.canvas.width, connections_ctx.canvas.height)

    // set the line styles
    connections_ctx.fillStyle = 'hsl(240, 7%, 20%)'
    connections_ctx.strokeStyle = 'hsl(240, 7%, 20%)'
    connections_ctx.lineWidth = dot_size * 2
    connections_ctx.lineCap = 'butt'

    // get the first point of the line
    let line_first_point_screen = connection_points[0].to_screen()

    // draw the lines
    connections_ctx.beginPath()
    connections_ctx.moveTo(line_first_point_screen.x, line_first_point_screen.y)
    for (let point_index = 1; point_index < connection_points.length; point_index++) {
        // convert the point to screen coordinates
        let point_screen = connection_points[point_index].to_screen()
        // draw the line
        connections_ctx.lineTo(point_screen.x, point_screen.y)
    }
    connections_ctx.stroke()

    // draw the points
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
}

function simplify_connection() {
    // this method simplifies the connection by loving, removing and merging points

    // for each line in the connection
    // we ignore the last line because it is the one that follows the mouse
    for (let line_1_index = 0; line_1_index < connection_points.length - 2; line_1_index++) {
        // find the orientation of the first line
        let line_1_start  = connection_points[line_1_index]
        let line_1_end = connection_points[line_1_index+1]
        let first_line_orientation = line_orientation(line_1_start, line_1_end)

        // check if the point and its neighbor overlap
        if (first_line_orientation === Orientation.Unknown) {
            // remove the following point
            connection_points.splice(line_1_index + 1, 1)
            // re-run the loop on the same index to check for further simplifications
            continue
        }

        // for each line after the first one
        // we use a while loop because we might remove points,
        // so some times we might want to re-run the loop on the same index,
        // consequence : for loops are not suited
        // we also ignore the last point because it does not represent
        // the start of a new line, but only the end of the last line
        let line_2_index = line_1_index + 1
        while (line_2_index < connection_points.length - 1) {
            // find the orientation of the second line
            let line_2_start = connection_points[line_2_index]
            let line_2_end = connection_points[line_2_index+1]
            let second_line_orientation = line_orientation(line_2_start, line_2_end)

            // check cross over if the lines are perpendicular
            if (first_line_orientation !== second_line_orientation) {
                // ignore the check if the two lines are connected,
                // because we don't want to merge connected lines that are perpendicular
                if (line_1_index + 1 !== line_2_index) {
                    // check if the two lines cross each other
                    if (do_lines_crossover(first_line_orientation, line_1_start, line_1_end, line_2_start, line_2_end)) {
                        // the two lines cross each other, move the second point of the first line
                        if (first_line_orientation === Orientation.Horizontal) { line_1_end.x = line_2_start.x }
                        else if (orientation === Orientation.Vertical) { line_1_end.y = line_2_start.y }
                        // remove the unnecessary points
                        connection_points.splice(line_1_index + 2, line_2_index - line_1_index - 1)
                        // re-run the loop on the same index to check for further simplifications
                        continue
                    }
                }
            }
            // check overlap if the lines are parallel
            if (first_line_orientation === second_line_orientation) {
                // we don't check if the two lines are connect,
                // because we want to merge connected lines that are parallel
                // check if the lines cross each other
                if (do_lines_overlap(first_line_orientation, line_1_start, line_1_end, line_2_start, line_2_end)) {
                    // if they do, remove the unnecessary points
                    connection_points.splice(line_1_index + 1, line_2_index - line_1_index)
                    // re-run the loop on the same index to check for further simplifications
                    continue
                }
            }

            // increment the second line index if we didn't find any simplification to do
            line_2_index += 1
        }
    }
}

function line_orientation(line_start: Vector, line_end: Vector): Orientation {
    // this function returns the orientation of a line
    // it makes the assumption that the line is either horizontal or vertical

    // if the line is of zero length, ignore
    if (line_start.is_equal_to(line_end)) { return Orientation.Unknown }

    // check if the line is horizontal or vertical
    if (line_start.x === line_end.x) { return Orientation.Vertical }
    else if (line_start.y === line_end.y) { return Orientation.Horizontal }
    else { throw new Error('Invalid line direction') }
}

function do_lines_crossover(
    first_line_orientation: Orientation,
    line_1_start: Vector, line_1_end: Vector,
    line_2_start: Vector, line_2_end: Vector
): boolean {
    // this function checks if the two lines cross each other
    // it makes the assumption that the lines are at 90 degrees to each other
    // and that the first line is going in the direorientationction specified by the first_line_orientation parameter
    if (first_line_orientation === Orientation.Horizontal) {
        return  (
                    Math.min(line_2_start.y, line_2_end.y) <= line_1_start.y &&
                    line_1_start.y <= Math.max(line_2_start.y, line_2_end.y) &&
                    Math.min(line_1_start.x, line_1_end.x) <= line_2_start.x &&
                    line_2_start.x <= Math.max(line_1_start.x, line_1_end.x)
                )
    }
    else if (first_line_orientation === Orientation.Vertical) {
        return  (
                    Math.min(line_2_start.x, line_2_end.x) <= line_1_start.x &&
                    line_1_start.x <= Math.max(line_2_start.x, line_2_end.x) &&
                    Math.min(line_1_start.y, line_1_end.y) <= line_2_start.y &&
                    line_2_start.y <= Math.max(line_1_start.y, line_1_end.y)
                )
    } else {
        throw new Error('Invalid orientation specified')
    }
}

function do_lines_overlap(
    first_line_orientation: Orientation,
    line_1_start: Vector, line_1_end: Vector,
    line_2_start: Vector, line_2_end: Vector
): boolean {
    // this function checks if the two lines overlap each other
    // it makes the assumption that the lines are parallel
    // and that both lines are going in the orientation specified by the first_line_orientation parameter
    if (first_line_orientation === Orientation.Horizontal) {
        return  line_1_start.y === line_2_start.y &&
                Math.min(line_2_start.x, line_2_end.x) <= Math.max(line_1_start.x, line_1_end.x) &&
                Math.min(line_1_start.x, line_1_end.x) <= Math.max(line_2_start.x, line_2_end.x)
    } else if (first_line_orientation === Orientation.Vertical) {
        return  line_1_start.x === line_2_start.x &&
                Math.min(line_2_start.y, line_2_end.y) <= Math.max(line_1_start.y, line_1_end.y) &&
                Math.min(line_1_start.y, line_1_end.y) <= Math.max(line_2_start.y, line_2_end.y)
    } else {
        throw new Error('Invalid orientation specified')        
    }
}
