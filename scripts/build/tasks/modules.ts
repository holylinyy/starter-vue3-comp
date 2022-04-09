import glob from 'fast-glob'
import type { OutputOptions } from 'rollup'
import { rollup } from 'rollup'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'
import { excludeFiles, generateExternal, srcRoot, writeBundles } from '../utils'
import { buildConfigEntries } from '../build-info'

export const buildModules = async () => {
  const input = excludeFiles(
    await glob('**/*.{js,ts,vue,jsx,tsx}', {
      cwd: srcRoot,
      absolute: true,
      onlyFiles: true,
    }),
  )
  const bundle = await rollup({
    input,
    plugins: [
      vue({
        isProduction: false,
      }),
      vueJsx(),
      nodeResolve(),
      commonjs(),
      esbuild({
        target: 'esnext',
        minify: false,
      }),
    ],
    external: await generateExternal(),
    treeshake: false,
  })

  await writeBundles(
    bundle,
    buildConfigEntries.map(([module, config]): OutputOptions => {
      return {
        format: config.format,
        dir: config.output.path,
        exports: module === 'cjs' ? 'named' : undefined,
        preserveModules: true,
        preserveModulesRoot: srcRoot,
        sourcemap: true,
        entryFileNames: `[name].${config.ext}`,
      }
    }),
  )
}
