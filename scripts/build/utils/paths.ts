import { resolve } from 'path'

export const projRoot = resolve(__dirname, '..', '..', '..')
export const buildOutput = resolve(projRoot, 'dist')
export const srcRoot = resolve(projRoot, 'src')
export const pkgPath = resolve(projRoot, 'package.json')
