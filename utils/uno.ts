/**
 * 创建一个通用的状态变体工厂函数
 * @param name - 变体名称 (e.g., "disabled")
 * @param states - CSS 属性选择器数组 (e.g., ["[disabled]", "[data-disabled='true']"])
 * @param options - 配置项 { pseudoClass?: 'is' | 'not', isGroup?: boolean }
 * @returns UnoCSS Variant 对象
 */
export function createVariant(
  name: string,
  states: string[],
  options: { pseudoClass?: "is" | "not"; isGroup?: boolean } = {},
): any {
  const { pseudoClass = "is", isGroup = false } = options;
  const prefix = `${name}:`;

  return {
    name,
    match(matcher: string) {
      if (!matcher.startsWith(prefix)) {
        return;
      }
      return {
        matcher: matcher.slice(prefix.length),
        selector: (s: string) =>
          isGroup
            ? `.group:${pseudoClass}(${states.join(", ")}) ${s}`
            : `${s}:${pseudoClass}(${states.join(", ")})`,
      };
    },
    multiPass: true,
  };
}

/**
 * gradient_border-[linear-gradient(...)] 中 Uno 用 `_` 表示空格，需还原为真实空格；
 * 但 `var(--edgen-xxx_yyy)` 内的下划线必须保留，否则变量名无效。
 */
export function gradientBorderUnoUnderscoresToSpaces(input: string): string {
  const vars: string[] = [];
  let idx = 0;
  const masked = input.replace(/var\([^)]*\)/g, (m) => {
    vars.push(m);
    return `§§§V${idx++}§§§`;
  });
  return masked
    .replace(/_/g, " ")
    .replace(/§§§V(\d+)§§§/g, (_, j) => vars[Number(j)]!);
}

/** ring-progress 的 rp-*-[...] 任意值：Uno 中下划线还原为空格，并保留 var() 内下划线 */
function ringArbitraryBracketValue(raw: string): string {
  return gradientBorderUnoUnderscoresToSpaces(raw);
}

/** rp-b-xxx / rp-a-xxx：优先主题 colors，否则按 CSS 颜色字面量（如 red）或已展开的 token */
function ringThemeColorOrLiteral(
  token: string,
  theme: { colors?: Record<string, string> },
): string {
  const fromTheme = theme.colors?.[token];
  if (typeof fromTheme === "string") {
    return fromTheme;
  }
  return token;
}

/**
 * Uno 里 `rp-b-[#xxx]` 有时会整段落到 `rp-b-(.+)`，capture 为 `[#xxx]`，直接当颜色会非法。
 * 去掉最外层一对 [] 后再走任意值解析。
 */
export function ringColorTokenToCss(
  token: string,
  theme: { colors?: Record<string, string> },
): string {
  const trimmed = token.trim();
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    return ringArbitraryBracketValue(trimmed.slice(1, -1).trim());
  }
  return ringThemeColorOrLiteral(trimmed, theme);
}