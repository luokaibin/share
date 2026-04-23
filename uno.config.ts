import { defineConfig } from 'unocss'
import { createVariant, gradientBorderUnoUnderscoresToSpaces, ringColorTokenToCss } from './utils/uno'


/**
 * 项目级 UnoCSS 配置。Slidev 会通过 `mergeConfigs` 将其叠在
 * `@slidev/client/uno.config`（Wind3、Attributify、Typography、MDC 提取器等）之上。
 * 这里一般只写增量：theme、shortcuts、rules、safelist 等，无需重复声明 presets。
 */
export default defineConfig({
  theme: {
    // 示例：扩展色板（与 slides 里 `emerald-*`、`slate-*` 等可并存）
    // colors: {
    //   brand: {
    //     DEFAULT: '#34d399',
    //     muted: '#6ee7b7',
    //   },
    // },
  },
  variants: [
    // Single state variants
    createVariant("loading", [".loading", "[data-loading='true']"]),
    createVariant("disabled", ["[disabled]", "[data-disabled='true']"]),
    createVariant("actived", ["[active]", "[data-actived='true']"]),

    // Combined state variants
    createVariant("loading-or-disabled", [
      ".loading",
      "[data-loading='true']",
      "[disabled]",
      "[data-disabled='true']",
    ]),

    // 'not' variants
    createVariant("not-loading", [".loading", "[data-loading='true']"], {
      pseudoClass: "not",
    }),
    createVariant("not-actived", ["[active]", "[data-actived='true']"], {
      pseudoClass: "not",
    }),
    createVariant(
      "not-loading-and-disabled",
      [
        ".loading",
        "[data-loading='true']",
        "[disabled]",
        "[data-disabled='true']",
      ],
      { pseudoClass: "not" },
    ),

    // Group variants
    createVariant("group-loading", [".loading", "[data-loading='true']"], {
      isGroup: true,
    }),
    createVariant(
      "group-loading-or-disabled",
      [
        ".loading",
        "[data-loading='true']",
        "[disabled]",
        "[data-disabled='true']",
      ],
      { isGroup: true },
    ),
    createVariant(
      "group-not-loading-or-disabled",
      [
        ".loading",
        "[data-loading='true']",
        "[disabled]",
        "[data-disabled='true']",
      ],
      { isGroup: true, pseudoClass: "not" },
    ),
  ],

  shortcuts: {
    gradient_border:
      "relative border-width-[var(--gradient-border-width,1px)] bg-origin-border border-solid border-transparent before:content-[''] before:absolute before:-inset-[var(--gradient-border-width,1px)] before:[background-image:var(--gradient-border-color)] before:p-[var(--gradient-border-width,1px)] before:[mask:linear-gradient(#fff_0_0)_content-box_exclude,linear-gradient(#fff_0_0)] before:rounded-[inherit]",
    skeleton:
      "text-transparent inline bg-[#f8f6f2] box-decoration-clone animate-pulse pointer-events-none",
    // 圆环进度：配合 rp-w / rp-p / rp-b / rp-a；mask 内 calc 须用 _ 表示空格
    "ring-progress": `
      relative inline-flex items-center justify-center rounded-full isolate
      before:content-[''] before:pointer-events-none before:absolute before:inset-0 before:z-0 before:rounded-full
      before:[background:conic-gradient(var(--ring-accent,currentColor)_calc(var(--ring-percent,0)_*_1%),var(--ring-base,#e5e7eb)_0)]
      before:[mask:radial-gradient(farthest-side,transparent_calc(100%_-_var(--ring-width,4px)_-_0.5px),#000_calc(100%_-_var(--ring-width,4px)))]
      before:[-webkit-mask:radial-gradient(farthest-side,transparent_calc(100%_-_var(--ring-width,4px)_-_0.5px),#000_calc(100%_-_var(--ring-width,4px)))]
    `,
    "page": "flex h-full min-h-0 flex-col",
    "flex-center": "items-center justify-center",
  },
  /**
   * 构建时无法被静态扫描到的类名放这里（例如完全由字符串拼接出来的工具类）。
   * 写在 `slides.md` / Vue 模板里的字面量类通常不需要。
   */
  safelist: [],

  rules: [
    [
      /^gradient_border-(.+)$/,
      ([, value]) => {
        // 但为了兼容，我们仍然移除方括号（如果存在）
        let cleanValue = value;
        if (cleanValue.startsWith("[") && cleanValue.endsWith("]")) {
          cleanValue = cleanValue.slice(1, -1);
        }

        // 处理数字（1, 2, 3）和小数（0.5）
        // UnoCSS 的数字映射：1 = 0.25rem = 4px, 2 = 0.5rem = 8px, 0.5 = 0.125rem = 2px
        const numValue = parseFloat(cleanValue);
        if (!isNaN(numValue)) {
          // 转换为像素值：1 -> 4px, 2 -> 8px, 0.5 -> 2px
          const pxValue = `${numValue * 4}px`;
          return {
            "--gradient-border-width": pxValue,
          };
        }
        // 如果不是数字，可能是任意值，尝试作为渐变值
        // 处理 gradient_border-[linear-gradient(...)] 的情况
        // UnoCSS 会用下划线代替空格，需要还原
        if (
          cleanValue.includes("linear-gradient") ||
          cleanValue.includes("gradient") ||
          cleanValue.startsWith("linear")
        ) {
          return {
            "--gradient-border-color":
              gradientBorderUnoUnderscoresToSpaces(cleanValue),
          };
        }
        return {};
      },
    ],
    // ring-progress 变体：rp-w 环宽、rp-p 进度(0–100)、rp-b 底色、rp-a 高亮色（先匹配 [...] 任意值）
    [
      /^rp-w-\[(.+)\]$/,
      // @ts-expect-error type
      ([, raw]) => ({ "--ring-width": ringArbitraryBracketValue(raw) }),
    ],
    [
      /^rp-w-(\d+(\.\d+)?)$/,
      ([, num]) => ({
        "--ring-width": `${parseFloat(num) * 4}px`,
      }),
    ],
    [
      /^rp-p-\[(\d+(\.\d+)?)\]$/,
      ([, p]) => ({ "--ring-percent": p }),
    ],
    [
      /^rp-p-(\d+(\.\d+)?)$/,
      ([, p]) => ({ "--ring-percent": p }),
    ],
    [
      /^rp-b-(.+)$/,
      ([, token], { theme }) => ({
        "--ring-base": ringColorTokenToCss(
          token,
          theme as { colors?: Record<string, string> },
        ),
      }),
    ],
    [
      /^rp-a-(.+)$/,
      ([, token], { theme }) => ({
        "--ring-accent": ringColorTokenToCss(
          token,
          theme as { colors?: Record<string, string> },
        ),
      }),
    ],
  ],
})
