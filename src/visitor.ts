import type { Visitor, CustomAtRules } from 'lightningcss'

interface Options {
  designWidth: number
  minPixelValue: number
  excludeSelectors: { type: string; name: RegExp | string }[]
}

const baseOptions: Options = {
  designWidth: 320,
  minPixelValue: 1,
  excludeSelectors: [],
}

function createExcludeFilter(excludes: Options['excludeSelectors']) {
  const isExclude = (testItem: { type: string; name?: string }) => {
    if (!testItem.name) {
      return false
    }
    for (const rule of excludes) {
      if (testItem.type === rule.type) {
        if (typeof rule.name === 'string' && rule.name === testItem.name) {
          return true
        }
        if (typeof rule.name === 'object' && rule.name.test(testItem.name)) {
          return true
        }
      }
    }
    return false
  }

  return isExclude
}

export function createPxToVwVisitor(userOptions: Partial<Options> = {}) {
  const options = Object.assign(baseOptions, userOptions)
  const isExclude = createExcludeFilter(options.excludeSelectors)

  let skipCurrentSelector = false

  return {
    Selector(selectors) {
      skipCurrentSelector = false
      for (const selector of selectors) {
        if (isExclude(selector)) {
          skipCurrentSelector = true
        }
      }
    },
    Length(length) {
      console.log(length)
      if (length.unit === 'px' && !skipCurrentSelector) {
        if (length.value > options.minPixelValue) {
          return {
            unit: 'vw',
            value: (length.value / options.designWidth) * 100,
          }
        }
      }
    },
  } satisfies Visitor<CustomAtRules>
}
