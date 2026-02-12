import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ★ここを「GitHubリポジトリ名」に合わせて変更してください
// 例: repo = Amber_Home -> "/Amber_Home/"
// 例: repo = amber-home -> "/amber-home/"
const BASE_REPO_NAME = "Amber_Home";

export default defineConfig({
  plugins: [react()],
  base: `/${BASE_REPO_NAME}/`
});
