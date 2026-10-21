# 黄钶卿个人简历

基于 Vue 3 和 Vite 构建的响应式个人简历网站。项目经验、完整荣誉档案与证书原件均在同一页面展示，可通过 GitHub Actions 自动部署到 GitHub Pages。

荣誉记录维护在 `src/data/honors.js`；证书图片或 PDF 放在 `public/honors/files`，PDF 的缩略图放在 `public/honors/covers`。

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
