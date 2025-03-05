import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: 'localhost', // 或 '0.0.0.0'
    port: 5173,        // 确保端口是 5173（或任何未被占用的端口）
  },
  plugins: [
    react(),
    ...(mode === 'development' ? [componentTagger()] : [])  // 仅在开发模式下使用 componentTagger 插件
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    postcss: './postcss.config.js', // 显式指定 postcss 配置文件路径
  },
  // Add base path for GitHub Pages deployment
  // base: '/Multi-agent/', // 使用你的仓库名称替换 'Multi-agent'
}));