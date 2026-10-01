import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
export default defineConfig(function (_a) {
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), '');
    return {
        plugins: [react()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
                '@pages': path.resolve(__dirname, './src/Pages'),
                '@scripts': path.resolve(__dirname, './src/Scripts'),
                '@styles': path.resolve(__dirname, './src/Styles'),
                '@modules': path.resolve(__dirname, './src/Modules'),
            },
        },
        server: {
            port: 5173,
            proxy: {
                '/api': {
                    target: env.VITE_API_PROXY_TARGET || 'http://localhost:3001',
                    changeOrigin: true,
                },
            },
        },
    };
});
