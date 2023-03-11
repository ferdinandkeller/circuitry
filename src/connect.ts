// let is_connect_dragging = false
// let start_x = 0
// let start_y = 0
// let end_x = 0
// let end_y = 0

// document.addEventListener('mousedown', (e: MouseEvent) => {
//   if (mouse_operation !== MouseOperation.Connect) return
//   if (conn_ctx === null) return

//   // start dragging
//   is_connect_dragging = true

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
//   if (mouse_operation !== MouseOperation.Connect) return
//   if (!is_connect_dragging) return
//   if (conn_ctx === null) return

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
//   if (mouse_operation !== MouseOperation.Connect) return
//   if (!is_connect_dragging) return
//   if (conn_ctx === null) return

//   // clean the canvas
//   conn_ctx.clearRect(0, 0, conn_ctx.canvas.width, conn_ctx.canvas.height)

//   // turn off connect dragging
//   is_connect_dragging = false
// })
