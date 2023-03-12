import { viewbox_pos } from './viewbox'

// define a canvas context clearing method
export function clear_canvas(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

// define a method to round a number to a multiple of another number
export function modulo_rounding(num: number, modulo: number): number {
    return Math.round(num / modulo) * modulo
}

// define a method to ceil a number to a multiple of another number
export function modulo_ceiling(num: number, modulo: number): number {
    return Math.ceil(num / modulo) * modulo
}

// define a method to floor a number to a multiple of another number
export function modulo_flooring(num: number, modulo: number): number {
    return Math.floor(num / modulo) * modulo
}

// define a struct modulo function
export function mod(num: number, modulo: number): number {
    return ((num % modulo) + modulo) % modulo
}

// define a vector struct
export class Vector {
    x: number
    y: number

    // instantiation methods
    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    static zero(): Vector {
        return new Vector(0, 0)
    }

    // vector operations methods
    add(vector: Vector): Vector {
        return new Vector(this.x + vector.x, this.y + vector.y)
    }

    add_assign(vector: Vector): Vector {
        this.x += vector.x
        this.y += vector.y
        return this
    }

    sub(vector: Vector): Vector {
        return new Vector(this.x - vector.x, this.y - vector.y)
    }

    sub_assign(vector: Vector): Vector {
        this.x -= vector.x
        this.y -= vector.y
        return this
    }

    mul(vector: Vector): Vector {
        return new Vector(this.x * vector.x, this.y * vector.y)
    }

    mul_assign(vector: Vector): Vector {
        this.x *= vector.x
        this.y *= vector.y
        return this
    }

    div(vector: Vector): Vector {
        return new Vector(this.x / vector.x, this.y / vector.y)
    }

    div_assign(vector: Vector): Vector {
        this.x /= vector.x
        this.y /= vector.y
        return this
    }

    neg(): Vector {
        return new Vector(-this.x, -this.y)
    }

    neg_assign(): Vector {
        this.x = -this.x
        this.y = -this.y
        return this
    }

    abs(): Vector {
        return new Vector(Math.abs(this.x), Math.abs(this.y))
    }

    abs_assign(): Vector {
        this.x = Math.abs(this.x)
        this.y = Math.abs(this.y)
        return this
    }

    // duplication and assignment methods
    copy(): Vector {
        return new Vector(this.x, this.y)
    }

    set_num(x: number, y: number): Vector {
        this.x = x
        this.y = y
        return this
    }

    set(vector: Vector): Vector {
        this.x = vector.x
        this.y = vector.y
        return this
    }

    // modulo methods
    modulo_rounding(modulo: number): Vector {
        return new Vector(
            modulo_rounding(this.x, modulo),
            modulo_rounding(this.y, modulo)
        )
    }

    modulo_ceiling(modulo: number): Vector {
        return new Vector(
            modulo_ceiling(this.x, modulo),
            modulo_ceiling(this.y, modulo)
        )
    }

    modulo_flooring(modulo: number): Vector {
        return new Vector(
            modulo_flooring(this.x, modulo),
            modulo_flooring(this.y, modulo)
        )
    }

    mod(modulo: number): Vector {
        return new Vector(
            mod(this.x, modulo),
            mod(this.y, modulo)
        )
    }

    // add referencial conversion methods
    to_world(): Vector {
        return this.add(viewbox_pos)
    }

    to_world_assign(): Vector {
        return this.add_assign(viewbox_pos)
    }

    to_screen(): Vector {
        return this.sub(viewbox_pos)
    }

    to_screen_assign(): Vector {
        return this.sub_assign(viewbox_pos)
    }

    // add comparison methods
    is_equal_to(vector: Vector): boolean {
        return this.x === vector.x && this.y === vector.y
    }
}
