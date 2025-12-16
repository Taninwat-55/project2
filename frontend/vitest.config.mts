import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    // key: map the '@' symbol to the current directory
    alias: {
      "@": resolve(__dirname, "."),
    },
  },
});

// import { defineConfig } from 'vitest/config'
// import react from '@vitejs/plugin-react'
// import { fileURLToPath } from 'url'

// export default defineConfig({
//   plugins: [react()],
//   test: {
//     environment: 'jsdom',
//     alias: {
//         '@': fileURLToPath(new URL('./', import.meta.url))
//     }
//   },
// })
