import './style.scss'

let renderer = document.getElementById('renderer') as HTMLDivElement
let background_canvas = document.getElementById('background') as HTMLCanvasElement
let background_tmp_canvas = document.createElement('canvas') as HTMLCanvasElement

let bg_ctx = background_canvas.getContext('2d')
let bg_tmp_ctx = background_tmp_canvas.getContext('2d')

if (bg_ctx === null) {
  throw new Error('Could not get canvas context')
}

let pixel_ratio = window.devicePixelRatio
let block_size = 20
let dot_size = 2
let center_line_width = 3
let center_line_size = 5

function integer_ceiling(num: number, modulo: number): number {
  return num - (num % modulo) + modulo
}

function resize_canvas() {
  if (bg_ctx === null || bg_tmp_ctx === null) return

  // resize visible canvas
  bg_ctx.canvas.width = pixel_ratio * renderer.clientWidth
  bg_ctx.canvas.height = pixel_ratio * renderer.clientHeight
  bg_ctx.scale(pixel_ratio, pixel_ratio)

  // resize the tmp canvas
  bg_tmp_ctx.canvas.width = pixel_ratio * (integer_ceiling(renderer.clientWidth, block_size) + 2 * block_size)
  bg_tmp_ctx.canvas.height = pixel_ratio * (integer_ceiling(renderer.clientHeight, block_size) + 2 * block_size)
  bg_tmp_ctx.scale(pixel_ratio, pixel_ratio)
}

function render_tmp_background() {
  if (bg_tmp_ctx === null) return
  if (bg_ctx === null) return

  bg_tmp_ctx.fillStyle = 'hsl(240, 7%, 80%)'
  
  let width_point_cound = Math.ceil(bg_tmp_ctx.canvas.width / block_size)
  let height_point_cound = Math.ceil(bg_tmp_ctx.canvas.height / block_size)
  
  for (let x = 0; x < width_point_cound; x++) {
    for (let y = 0; y < height_point_cound; y++) {
      bg_tmp_ctx.beginPath()
      bg_tmp_ctx.arc(x * block_size, y * block_size, dot_size/2, 0, 2 * Math.PI)
      bg_tmp_ctx.fill()
    }
  }
}

function render_background(current_x: number = 0, current_y: number = 0) {
  // check that the contexts are not null
  if (bg_ctx === null || bg_tmp_ctx === null) return

  // compute modulo of the current position
  let mod_x = current_x % block_size
  let mod_y = current_y % block_size

  // clear the visible canvas
  bg_ctx.clearRect(0, 0, bg_ctx.canvas.width, bg_ctx.canvas.height)

  // draw the background on the visible canvas
  bg_ctx.drawImage(bg_tmp_ctx.canvas, mod_x - block_size, mod_y - block_size, bg_tmp_ctx.canvas.width / pixel_ratio, bg_tmp_ctx.canvas.height / pixel_ratio);

  // draw the center point on the canvas
  bg_ctx.fillStyle = 'hsl(240, 7%, 20%)'
  bg_ctx.lineWidth = center_line_width
  bg_ctx.lineCap = 'round'

  bg_ctx.beginPath()
  bg_ctx.moveTo(current_x - center_line_size, current_y)
  bg_ctx.lineTo(current_x + center_line_size, current_y)
  bg_ctx.stroke()

  bg_ctx.beginPath()
  bg_ctx.moveTo(current_x, current_y - center_line_size)
  bg_ctx.lineTo(current_x, current_y + center_line_size)
  bg_ctx.stroke()
}

// handle dragging event
let is_dragging = false
let drag_start_x = 0
let drag_start_y = 0
let current_x = window.innerWidth / 2
let current_y = window.innerHeight / 2

document.addEventListener('mousedown', (e: MouseEvent) => {
  is_dragging = true
  drag_start_x = e.clientX
  drag_start_y = e.clientY
})

document.addEventListener('mousemove', (e: MouseEvent) => {
  if (!is_dragging) return

  let delta_x = e.clientX - drag_start_x
  let delta_y = e.clientY - drag_start_y

  let new_x = current_x + delta_x
  let new_y = current_y + delta_y

  render_background(new_x, new_y)
})

document.addEventListener('mouseup', (e: MouseEvent) => {
  is_dragging = false

  let delta_x = e.clientX - drag_start_x
  let delta_y = e.clientY - drag_start_y

  let new_x = current_x + delta_x
  let new_y = current_y + delta_y

  current_x = new_x
  current_y = new_y

  render_background(current_x, current_y)
})

function full_render() {
  // resize the canvas to fit the window
  resize_canvas()
  // render the cache background
  render_tmp_background()
  // render the cache background on the visible canvas
  render_background(current_x, current_y)
}

// whenever the window is resized, re-render the background
window.addEventListener('resize', _ => full_render())

// trigger an initial full render
full_render()