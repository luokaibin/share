# code-shre

基于 [Slidev](https://sli.dev) 的演示项目：`slides.md` 共 **3 页**。第 3 页为 **原生 `<div>` + `$clicks`** 分栏，上半区为 **Markdown 围栏** ` ```md magic-move `（与 HTML 混排），与 **`clicks: 2`** 串联三步。

## 运行

```bash
npm install
npm run dev
```

默认入口为根目录的 `slides.md`。构建静态资源：`npm run build`，输出在 `dist/`。

## 说明

- 动画与选项见 [官方文档](https://sli.dev/features/shiki-magic-move)。
- 编辑 `slides.md` 即可改幻灯片内容与 Magic Move 步骤。
