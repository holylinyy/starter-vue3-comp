import { mkdir } from 'fs/promises'
import path from 'path'
import type { TaskFunction } from 'gulp'
import { parallel, series } from 'gulp'
import { copy } from 'fs-extra'
import { run } from './utils/process'
import { runTask, withTaskName } from './utils/withTaskName'
import { buildOutput } from './utils/paths'
import type { Module } from './build-info'
import { buildConfig } from './build-info'

export const copyTypesDefinitions: TaskFunction = (done) => {
  const src = path.resolve(buildOutput, 'types')
  const copyTypes = (module: Module) =>
    withTaskName(`copyTypes:${module}`, () =>
      copy(src, buildConfig[module].output.path, { recursive: true }),
    )

  return parallel(copyTypes('esm'), copyTypes('cjs'))(done)
}

export default series(
  withTaskName('clean', () => run('rimraf dist')),
  withTaskName('create output', () => mkdir(buildOutput, { recursive: true })),
  parallel(
    runTask('buildModules'),
    runTask('generateTypesDefinitions'),
  ),
  parallel(copyTypesDefinitions),
)

export * from './tasks'
