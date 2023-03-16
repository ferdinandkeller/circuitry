import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
    base: '/circuitry/',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src/circuitry_editor'),
        }
    }
})