import { defineConfig, externalizeDepsPlugin, swcPlugin } from "electron-vite";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), swcPlugin()],
  },
});
