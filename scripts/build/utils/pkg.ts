import type { ProjectManifest } from '@pnpm/types'
import { pkgPath } from './paths'

export const excludeFiles = (files: string[]) => {
  const excludes = ['node_modules', 'test', 'mock', 'gulpfile', 'dist', 'spec']
  return files.filter(
    path => !excludes.some(exclude => path.includes(exclude)),
  )
}
export const getPackageDependencies = () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { dependencies = {}, peerDependencies = {} } = require(pkgPath) as ProjectManifest
  return {
    dependencies: Object.keys(dependencies),
    peerDependencies: Object.keys(peerDependencies),
  }
}
