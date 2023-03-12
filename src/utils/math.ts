/**
 * Ceils a number to a multiple of another number.
 * 
 * @param num The number to ceil.
 * @param modulo The modulo precision.
 */
export function modulo_ceiling(num: number, modulo: number): number {
    return Math.ceil(num / modulo) * modulo
}

/**
 * Round a number to a multiple of another number.
 * 
 * @param num The number to round.
 * @param modulo The modulo precision.
 */
export function modulo_rounding(num: number, modulo: number): number {
    return Math.round(num / modulo) * modulo
}

/**
 * Floors a number to a multiple of another number.
 * 
 * @param num The number to floor.
 * @param modulo The modulo precision.
 */
export function modulo_flooring(num: number, modulo: number): number {
    return Math.floor(num / modulo) * modulo
}

/**
 * Modulo function that always returns a positive number.
 * 
 * @param num The number to modulo.
 * @param modulo The modulo precision.
 */
export function mod(num: number, modulo: number): number {
    return ((num % modulo) + modulo) % modulo
}
