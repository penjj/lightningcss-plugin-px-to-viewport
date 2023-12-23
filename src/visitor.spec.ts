import { expect, test } from 'vitest'
import { transform } from 'lightningcss'

import { createPxToVwVisitor } from './visitor'

test('transform unit', () => {
  const res = transform({
    minify: true,
    filename: 'test.css',
    code: Buffer.from(`
      .foo {
        width: 20px;
      }
    `),
    visitor: createPxToVwVisitor({
      designWidth: 400,
      minPixelValue: 1,
    }),
  })
  expect(res.code.toString()).toEqual('.foo{width:5vw}')
})

test('no transform min value', () => {
  const res = transform({
    minify: true,
    filename: 'test.css',
    code: Buffer.from(`
      .foo {
        width: 20px;
      }
    `),
    visitor: createPxToVwVisitor({
      designWidth: 400,
      minPixelValue: 20,
    }),
  })
  expect(res.code.toString()).toEqual('.foo{width:20px}')
})

test('no transform excludes selector (suit 1)', () => {
  const res = transform({
    minify: true,
    filename: 'test.css',
    code: Buffer.from(`
      .foo {
        width: 20px;
      }
      .bar {
        width: 30px;
      }
      .foo-bar {
        width: 20px;
      }
    `),
    visitor: createPxToVwVisitor({
      designWidth: 400,
      minPixelValue: 1,
      excludeSelectors: [{ type: 'class', name: 'foo' }],
    }),
  })
  expect(res.code.toString()).toEqual(
    '.foo{width:20px}.bar{width:7.5vw}.foo-bar{width:5vw}'
  )
})

test('no transform excludes selector (suit 2)', () => {
  const res = transform({
    minify: true,
    filename: 'test.css',
    code: Buffer.from(`
      .foo {
        width: 20px;
      }
      .bar {
        width: 30px;
      }
      .foo-bar {
        width: 20px;
      }
    `),
    visitor: createPxToVwVisitor({
      designWidth: 400,
      minPixelValue: 1,
      excludeSelectors: [{ type: 'class', name: /^foo/ }],
    }),
  })
  expect(res.code.toString()).toEqual(
    '.foo{width:20px}.bar{width:7.5vw}.foo-bar{width:20px}'
  )
})
