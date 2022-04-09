import path from 'path'
import fs from 'fs/promises'
import consola from 'consola'
import * as vueCompiler from 'vue/compiler-sfc'
import type { SourceFile } from 'ts-morph'
import { Project } from 'ts-morph'
import glob from 'fast-glob'
import { buildOutput, excludeFiles, projRoot, srcRoot } from '../utils'

const outDir = path.resolve(buildOutput, 'types')
const TSCONFIG_PATH = path.resolve(projRoot, 'tsconfig.json')

export const generateTypesDefinitions = async () => {
  const project = new Project({
    compilerOptions: {
      emitDeclarationOnly: true,
      outDir,
      baseUrl: projRoot,
      paths: {},
      preserveSymlinks: true,
      types: [
        path.resolve(projRoot, 'typings/global'),
      ],
    },
    tsConfigFilePath: TSCONFIG_PATH,
    skipAddingFilesFromTsConfig: true,
  })

  const globAnyFile = '**/*.{js?(x),ts?(x),vue}'

  const filePaths = excludeFiles(
    await glob([globAnyFile], {
      cwd: srcRoot,
      absolute: true,
      onlyFiles: true,
    }),
  )

  const sourceFiles: SourceFile[] = []

  await Promise.all([
    ...filePaths.map(async (file) => {
      if (file.endsWith('.vue')) {
        const content = await fs.readFile(file, 'utf-8')
        const sfc = vueCompiler.parse(content)
        const { script, scriptSetup } = sfc.descriptor
        if (script || scriptSetup) {
          let content = script?.content ?? ''

          if (scriptSetup) {
            const compiled = vueCompiler.compileScript(sfc.descriptor, {
              id: 'xxx',
            })
            content += compiled.content
          }

          const lang = scriptSetup?.lang || script?.lang || 'js'
          const sourceFile = project.createSourceFile(
            `${path.relative(process.cwd(), file)}.${lang}`,
            content,
          )
          sourceFiles.push(sourceFile)
        }
      } else {
        const sourceFile = project.addSourceFileAtPath(file)
        sourceFiles.push(sourceFile)
      }
    }),
  ])

  const diagnostics = project.getPreEmitDiagnostics()

  if (diagnostics.length > 0) {
    consola.error(project.formatDiagnosticsWithColorAndContext(diagnostics))
    const err = new Error('Failed to generate dts.')
    consola.error(err)
    throw err
  }

  await project.emit({
    emitOnlyDtsFiles: true,
  })
}
