# lightningcss-plugin-px-to-viewport

## Usage

```ts
// using with vite

import { defineConfig } from "vite";
import { composeVisitors } from "lightningcss";
import createPxToVwVisitor from "lightningcss-plugin-px-to-viewport";

export default defineConfig({
  css: {
    transform: "lightningcss",
    lightningcss: {
      visitor: composeVisitors([
        createPxToVwVisitor({
          designWidth: 320,
          minPixelValue: 1,
          excludeSelectors: [{ type: 'class', name: /^mui-/ }] // exclude `.mui-*` class
        }),
      ]),
    } as any,
  },
});
```
