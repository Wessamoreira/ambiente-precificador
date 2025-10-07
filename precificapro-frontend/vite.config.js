import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path'; // Importe o módulo 'path' do Node.js
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    // ADICIONE ESTA SEÇÃO 'resolve'
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
