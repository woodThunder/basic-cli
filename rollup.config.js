import terser from '@rollup/plugin-terser';
import babel from '@rollup/plugin-babel'
import json from '@rollup/plugin-json';
export default {
  input: ["./index.js"],
  output: {
    file: "./dist/index.js",
    format: "es",
    banner: "#!/usr/bin/env node"
  },
  plugins: [
    json(),
    babel({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
      presets: [
        [
          '@babel/preset-env',
          {
            targets: '> 0.25%, not dead',
          },
        ],
      ],
      plugins: [
        [
          "@babel/plugin-transform-runtime", // 按需引入代码，减少代码注入，提供沙盒环境
          {
            "corejs": 3 // 配合@babel/runtime-corejs3使用避免全局污染
          }
        ]
      ],
    }),
    terser(),
  ]
}