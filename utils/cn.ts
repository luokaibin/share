import classNames from 'classnames'
import { extendTailwindMerge } from 'tailwind-merge'

/** 从 themes.json 等设计体系提取的字体样式类名 */
const fontStyleClasses = [
  'display_l',
  'display_m',
  'display_s',
  'headline_l',
  'headline_m',
  'headline_s',
  'title_l',
  'title_m',
  'title_s',
  'button_l',
  'button_m',
  'button_s',
  'body_medium_l',
  'body_medium_m',
  'body_medium_s',
  'body_medium_xs',
  'body_xl',
  'body_l',
  'body_m',
  'body_s',
  'body_xs',
  'body_output',
  'body_bold_l',
  'body_bold_m',
  'body_bold_s',
  'body_bold_xs',
  'body_bold_xl',
] as const

const buttonStyleClasses = [
  'emphasis_button',
  'tonal_button',
  'primary_button',
  'link_button',
  'secondary_button',
] as const

const buttonSizeClasses = [
  'md_button',
  'sm_button',
  'xs_button',
  'xxs_button',
  's_button',
] as const

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-family': [...fontStyleClasses],
      'button-style': [...buttonStyleClasses],
      'button-size': [...buttonSizeClasses],
    } as Record<string, readonly string[]>,
  },
})

export function cn(
  ...args: classNames.ArgumentArray
): string {
  return customTwMerge(classNames(...args))
}
