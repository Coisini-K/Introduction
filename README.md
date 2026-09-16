# 黄钶卿个人简历

基于 Vue 3 和 Vite 构建的响应式个人简历网站，可通过 GitHub Actions 自动部署到 GitHub Pages。

## 本地开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
npm run preview
```

## GitHub Pages

1. 将项目推送到 GitHub 仓库的 `main` 分支。
2. 在仓库的 `Settings > Pages` 中，将 `Source` 设为 `GitHub Actions`。
3. 等待 `Deploy Vue site to GitHub Pages` 工作流完成。

Vite 使用相对资源路径，无需根据仓库名称修改 `base`。
