---
theme: seriph
title: Slidev Demo
magicMoveDuration: 720
transition: slide-left
---

# 目录

<Toc text-sm minDepth="1" maxDepth="2" />

---
clicks: 5
---

<script setup lang="ts">
import { cn } from './utils/cn'
</script>

<div class="page">

# 圆环中的文字实现方式

<div
  :class="cn('min-h-0 w-full flex-1 grid w-full transition-all duration-200 gap-2 grid-rows-[minmax(0,1fr)_minmax(0,0fr)]', {
    'grid-rows-[minmax(0,1fr)_minmax(0,1fr)]': $clicks >= 4,
  })"
>
  <section
    :class="cn('w-full h-full grid transition-all duration-200', {
      'grid-cols-[minmax(0,1fr)_minmax(0,0fr)] items-center': $clicks === 0,
      'grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center': $clicks >= 1,
    })"
  >
    <div class="flex flex-center mx-auto text-4xl size-40 shrink-0 ring-progress rp-w-4 rp-b-transparent rp-a-[#16a34a]" :style="{
      '--ring-percent': 72
    }">
      72%
    </div>
    <div class="h-full overflow-y-auto">

````md magic-move {lines: true}
```tsx [RingProgress.tsx]{1}
<div className="relative size-[44px] shrink-0">

</div>
```
```tsx [RingProgress.tsx]{1}
<div className="relative size-[44px] shrink-0">

</div>
```
```tsx [RingProgress.tsx]
<div className="relative size-[44px] shrink-0">
  <svg
    width="44"
    height="44"
    viewBox="0 0 44 44"
    className="absolute inset-0"
    style={
      isPC
        ? {
            filter: "drop-shadow(0 0 6px #47E9FF)",
          }
        : {}
    }
  >
    {/* 进度圆 - 居中描边 */}
    <circle
      cx="22"
      cy="22"
      r={radius}
      stroke={isPC ? "#89EAF7" : "rgba(6, 113, 71, 1)"}
      strokeWidth={3}
      fill="none"
      strokeDasharray={circumference}
      strokeDashoffset={strokeDashoffset}
      strokeLinecap="round"
      transform="rotate(-90 22 22)"
      style={{
        transition: "stroke-dashoffset 0.3s ease",
      }}
    />
  </svg>
</div>
```
```tsx [RingProgress.tsx]
<div className="relative size-[44px] shrink-0">
  <svg
    width="44"
    height="44"
    viewBox="0 0 44 44"
    className="absolute inset-0"
    style={
      isPC
        ? {
            filter: "drop-shadow(0 0 6px #47E9FF)",
          }
        : {}
    }
  >
    {/* 进度圆 - 居中描边 */}
    <circle
      cx="22"
      cy="22"
      r={radius}
      stroke={isPC ? "#89EAF7" : "rgba(6, 113, 71, 1)"}
      strokeWidth={3}
      fill="none"
      strokeDasharray={circumference}
      strokeDashoffset={strokeDashoffset}
      strokeLinecap="round"
      transform="rotate(-90 22 22)"
      style={{
        transition: "stroke-dashoffset 0.3s ease",
      }}
    />
  </svg>

  {/* 百分比文本 */}
  <div className="absolute inset-0 flex items-center justify-center">
    <p
      className={cn(
        "text-content_primary leading-none",
        isFullPercent ? "body_bold_m" : "body_bold_l",
      )}
    >
      {Math.round(normalizedPercent)}
      <span className="body_xs text-content_tertiary">%</span>
    </p>
  </div>
</div>
```
````
  </div>
  </section>
  <section
    :class="cn({
      'h-full w-full bg-red-200': true,
    })"
  />
</div>

</div>
