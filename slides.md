---
theme: seriph
title: Slidev Demo
magicMoveDuration: 720
transition: slide-left
---

---
layout: center
class: text-center
---

# 目录

<Toc text-sm minDepth="1" maxDepth="2" />

---

# 代码与布局流程

下一页把 **Magic Move** 放在 **上方区域**；**布局**用 `slides.md` 里的 **原生 `<div>` + `$clicks`**（不写 `SplitRevealLayout.vue`），与 **`clicks: 2`** 串成三步（本页不按步进，**一次 →** 进入下一页）：

1. **进入**：整格 **grid** 只有第一行有高度，内为 **State A**（上方为 **Markdown 围栏** ` ```md magic-move `，与外层 `<div>` 混排）
2. **第一次空格 / →**：**A → B** morph（由 Magic Move 消耗步进）
3. **第二次空格 / →**：`$clicks >= 2`，**`grid-template-rows`** 变为两行等高，**secondary** 显现

---

---
clicks: 2
---

<script setup lang="ts">
import { cn } from './utils/cn'
</script>

# 布局演示

**本页共 2 次步进再翻页**。外层布局用 **HTML**，通过 **`$clicks`**（与 `useSlideContext().$clicks` 同源）控制 **`grid-template-rows`**，逻辑等价于：

`const split = computed(() => $clicks >= 2)`（在模板里写成 **`$clicks >= 2`** 即可）。

<div
  class="split-root mx-auto w-full max-w-5xl overflow-hidden rounded-xl border border-white/12 bg-slate-950/50 shadow-2xl shadow-black/40 h-[min(72vh,640px)]"
  :style="{
    display: 'grid',
    gridTemplateRows: $clicks >= 2 ? 'minmax(0,1fr) minmax(0,1fr)' : 'minmax(0,1fr) 0fr',
    transition: 'grid-template-rows 650ms cubic-bezier(0.32, 0.72, 0, 1)',
  }"
>
  <section class="min-h-0 overflow-auto p-4 md:p-6 grid grid-cols-2">

  描述说明- 说明

````md magic-move {lines: true}
```ts [Counter.ts]
class Counter {
  private count = 0

  reset(): void {
    this.count = 0
  }

  increment(by = 1): void {
    this.count += by
  }
}
```
```ts [Counter.ts]
class Counter {
  increment(by = 1): void {
    this.value += by
  }

  private value = 0

  decrement(by = 1): void {
    this.value -= by
  }
}
```
````

  </section>
  <section
    :class="
      cn(
        'min-h-0 overflow-auto border-t p-4 transition-opacity duration-500 md:p-6',
        {
          'border-white/15 opacity-100': $clicks >= 2,
          'border-transparent opacity-0 pointer-events-none': $clicks < 2,
        },
      )
    "
  >
    <div class="flex h-full min-h-0 flex-col items-center justify-center gap-4">
      <img
        class="max-h-32 w-full max-w-sm rounded-lg object-cover opacity-90 ring-1 ring-emerald-500/30"
        src="https://picsum.photos/seed/slidev-secondary/520/300"
        alt=""
      />
      <p class="max-w-xl text-center text-sm text-slate-300">
        <strong class="text-emerald-200">secondary</strong>：<code>$clicks &gt;= 2</code> 后出现。
      </p>
      <pre class="w-full max-w-lg overflow-x-auto rounded-lg bg-black/50 p-3 text-left text-xs text-emerald-100/90 leading-relaxed font-mono ring-1 ring-white/10">// 下半区也可以是代码
async function load() {
  const m = await import('./mod')
  return m.setup()
}</pre>
    </div>
  </section>
</div>
