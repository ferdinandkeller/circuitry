// define a method to round a number to a multiple of another number
export function integer_rounding(num: number, modulo: number): number {
  return Math.round(num / modulo) * modulo
}

// define a method to ceil a number to a multiple of another number
export function integer_ceiling(num: number, modulo: number): number {
    return Math.ceil(num / modulo) * modulo
}

// define a method to floor a number to a multiple of another number
export function integer_flooring(num: number, modulo: number): number {
    return Math.floor(num / modulo) * modulo
}

// define a struct modulo function
export function mod(num: number, modulo: number): number {
  return ((num % modulo) + modulo) % modulo
}
