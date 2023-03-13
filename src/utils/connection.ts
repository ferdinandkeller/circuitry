import { Vector } from './vector'
import { render_connection_dot } from './rendering'
import { connection_line_width } from '@/editor/configuration'
import { Orientation } from '@/utils/orientation'
import { mod } from './math'

export class Connection {
    points: Vector[]

    constructor() {
        this.points = []
    }

    nth_point(index: number) {
        return this.points[mod(index, this.points.length)]
    }

    simplify_connection() {
        // this method simplifies the connection by loving, removing and merging points

        // for each line in the connection
        // we ignore the last line because it is the one that follows the mouse
        for (let line_1_index = 0; line_1_index < this.points.length - 2; line_1_index++) {
            // find the orientation of the first line
            let line_1_start  = this.points[line_1_index]
            let line_1_end = this.points[line_1_index+1]
            let first_line_orientation = this.#line_orientation(line_1_start, line_1_end)

            // check if the point and its neighbor overlap
            if (first_line_orientation === Orientation.Unknown) {
                // remove the following point
                this.points.splice(line_1_index + 1, 1)
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
            while (line_2_index < this.points.length - 1) {
                // find the orientation of the second line
                let line_2_start = this.points[line_2_index]
                let line_2_end = this.points[line_2_index+1]
                let second_line_orientation = this.#line_orientation(line_2_start, line_2_end)

                // check cross over if the lines are perpendicular
                if (first_line_orientation !== second_line_orientation) {
                    // ignore the check if the two lines are connected,
                    // because we don't want to merge connected lines that are perpendicular
                    if (line_1_index + 1 !== line_2_index) {
                        // check if the two lines cross each other
                        if (this.#do_lines_crossover(first_line_orientation, line_1_start, line_1_end, line_2_start, line_2_end)) {
                            // the two lines cross each other, move the second point of the first line
                            if (first_line_orientation === Orientation.Horizontal) { line_1_end.x = line_2_start.x }
                            else if (first_line_orientation === Orientation.Vertical) { line_1_end.y = line_2_start.y }
                            // remove the unnecessary points
                            this.points.splice(line_1_index + 2, line_2_index - line_1_index - 1)
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
                    if (this.#do_lines_overlap(first_line_orientation, line_1_start, line_1_end, line_2_start, line_2_end)) {
                        // if they do, remove the unnecessary points
                        this.points.splice(line_1_index + 1, line_2_index - line_1_index)
                        // re-run the loop on the same index to check for further simplifications
                        continue
                    }
                }

                // increment the second line index if we didn't find any simplification to do
                line_2_index += 1
            }
        }
    }

    #line_orientation(line_start: Vector, line_end: Vector): Orientation {
        // this function returns the orientation of a line
        // it makes the assumption that the line is either horizontal or vertical

        // if the line is of zero length, ignore
        if (line_start.is_equal_to(line_end)) { return Orientation.Unknown }

        // check if the line is horizontal or vertical
        if (line_start.x === line_end.x) { return Orientation.Vertical }
        else if (line_start.y === line_end.y) { return Orientation.Horizontal }
        else { throw new Error('Invalid line direction') }
    }

    #do_lines_crossover(
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

    #do_lines_overlap(
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

    render(ctx: CanvasRenderingContext2D) {
        // set the line styles
        ctx.fillStyle = 'hsl(240, 7%, 20%)'
        ctx.strokeStyle = 'hsl(240, 7%, 20%)'
        ctx.lineWidth = connection_line_width
        ctx.lineCap = 'butt'

        // get the first point of the line
        let line_first_point_screen = this.points[0].to_screen()

        // draw the lines
        ctx.beginPath()
        ctx.moveTo(line_first_point_screen.x, line_first_point_screen.y)
        for (let point_index = 1; point_index < this.points.length; point_index++) {
            // convert the point to screen coordinates
            let point_screen = this.points[point_index].to_screen()
            // draw the line
            ctx.lineTo(point_screen.x, point_screen.y)
        }
        ctx.stroke()

        // draw the points
        for (let point_world of this.points) {
            // convert the point to screen coordinates
            let point_screen = point_world.to_screen()

            // draw the point
            render_connection_dot(ctx, point_screen)
        }
    }
}
