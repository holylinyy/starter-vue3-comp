import type { OutputOptions, RollupBuild } from 'rollup'
import { getPackageDependencies } from './pkg'

export const generateExternal = async () => {
  const { dependencies, peerDependencies } = getPackageDependencies()
  return (id: string) => {
    const packages: string[] = peerDependencies
    packages.push('@vue', ...dependencies)
    return [...new Set(packages)].some(
      pkg => id === pkg || id.startsWith(`${pkg}/`),
    )
  }
}

export function writeBundles(bundle: RollupBuild, options: OutputOptions[]) {
  return Promise.all(options.map(option => bundle.write(option)))
}
